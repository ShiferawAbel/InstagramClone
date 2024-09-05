import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { User } from "../components/Posts/PostCard";

interface Comment {
  id: number;
  commentBody: string;
  createdAt: string;
  user: User;
}

interface FetchComments {
  data: Comment[];
}

const useComments = (postId: number) => useQuery({
  queryKey: ['comments', postId, 'post'],
  queryFn: () => 
    apiClient.get<FetchComments>(`posts/${postId}/comments`, {
      params: {
        user: true
      }
    }).then(res => res.data.data)
});

export default useComments