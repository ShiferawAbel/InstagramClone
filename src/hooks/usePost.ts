import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiClient from '../services/apiClient'
import { Post } from './usePosts'

interface FetchPost {
  data: Post
}
const usePost = (id: string | undefined) => useQuery({
  queryKey: ['post', id],
  queryFn: async () =>
    await apiClient.get<FetchPost>(`/posts/${id}`).then(res => res.data.data)
})

export default usePost