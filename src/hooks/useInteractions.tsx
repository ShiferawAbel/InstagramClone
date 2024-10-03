import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import apiClient from '../services/apiClient';

export interface InteractionInterface {
  id: number;
  interactionType: "follow" | "unfollow";
}
const useInteractions = () => {
  const queryClient = useQueryClient();
  return  useMutation({
    mutationFn: async ({ id, interactionType }: InteractionInterface) =>
      apiClient
        .post(
          `http://localhost:8000/api/v1/${interactionType}/${id}`,
          {})
        .then((res) => {
          queryClient.invalidateQueries(["users"]);
        }),
  });
}

export default useInteractions