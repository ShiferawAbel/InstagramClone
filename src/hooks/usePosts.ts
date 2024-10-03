import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { User } from "../components/Posts/PostCard";

export interface Post {
  caption: string;
  fileUrl: string;
  id: number;
  uploadedBy: string;
  user: User;
  likedByUser: boolean,
  likedBy: User[];
  postedAt: string;
}

interface FetchResponse {
  data: Post[];
}
const usePosts = () => useQuery({
  queryKey: ['posts'],
  queryFn: () => 
    apiClient.get<FetchResponse>('/posts', {
      params: {
        user:true,
      }
    }).then(res => res.data.data)
})

export default usePosts