import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { getCsrfToken } from "../pages/Login";

interface PostComment {
  commentBody: string;
}
const usePostComments = (postId: number, onAdd: () => void) => {
  const csrfToken = getCsrfToken();
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: async (comment: PostComment) =>{
    await apiClient
      .post<PostComment>(`/comments/${postId}`, comment)
      .then(res => res.data)
    await queryClient.invalidateQueries({
      queryKey: ['comments', postId, 'post']
    })},
  onSuccess: (savedData, sentComment) => {
    onAdd();
  }
})}

export default usePostComments