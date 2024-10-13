import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiClient from "../services/apiClient";

export interface InteractionInterface {
  id: number;
  interactionType: "follow" | "unfollow";
  invalidate: 'posts' | 'users' | number
}
const useInteractions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, interactionType, invalidate }: InteractionInterface) => {
      await apiClient.post(
        `http://localhost:8000/api/v1/${interactionType}/${id}`,
        {}
      );
      console.log(invalidate)
      if (invalidate == "posts" || invalidate == "users" ) {
        await queryClient.invalidateQueries(["users"]);
        await queryClient.invalidateQueries(["posts"]);
      } else {
        await queryClient.invalidateQueries(["user", invalidate.toString()]);
      }
    },
  });
};

export default useInteractions;
