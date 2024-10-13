import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiClient from "../services/apiClient";

export interface InteractionInterface {
  id: number;
  interactionType: "follow" | "unfollow";
  invalidate: 'posts' | 'users' | number | 'user'
}
const useInteractions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, interactionType, invalidate }: InteractionInterface) => {
      console.log(id, interactionType, invalidate)
      await apiClient.post(
        `http://localhost:8000/api/v1/${interactionType}/${id}`,
        {}
      );
      // console.log(invalidate)
      if (invalidate == "posts" || invalidate == "users" ) {
        await queryClient.invalidateQueries(["users"]);
        await queryClient.invalidateQueries(["posts"]);
      } else if (invalidate == "user") {
        await queryClient.invalidateQueries(["user"]);
        
      } else {
        await queryClient.invalidateQueries(["user", invalidate.toString()]);
      }
    },
  });
};

export default useInteractions;
