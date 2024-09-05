import { useQuery } from "@tanstack/react-query";
import styles from "./posts.module.css";
import axios from "axios";
import PostCard from "./PostCard";
import useCsrfStore from "../../services/csrfStore";
import { getCsrfToken } from "../../pages/Login";
import { useEffect } from "react";
import usePosts from "../../hooks/usePosts";


const Posts = () => {
  // axios.defaults.withCredentials = true;
  // const csrfToken = getCsrfToken();
  // const { data, isLoading } = useQuery({
  //     queryKey: ["posts"],
  //     queryFn: () =>
  //       axios.get<FetchResponse>('http://localhost:8000/api/v1/posts', {
  //         params: {
  //           user: true
  //         },
  //         headers: {
  //           accept: 'application/json',
  //           'X-XSRF-TOKEN': csrfToken,
  //         },
  //         withCredentials: true,
  //       }).then(res => res.data.data),
  //     staleTime: 100,
  //     refetchInterval: 10000,
  //   });
  //   if (isLoading) return <h1>loading...</h1>;
  // console.log(data);
  const {data, isLoading}= usePosts();
  return (
    <div className={styles.posts}>
      {data?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;

// await axios
//   .get<FetchResponse>("http://127.0.0.1:8000/api/v1/posts", {
//     params: {
//       user: true,
//     },
//     headers: {
//       accept: 'application/json',
//       'X-XSRF-TOKEN': csrfToken,
//     },
//     withXSRFToken: true,
//     withCredentials: true,
//   })
//   .then((res) => {
//     return res.data.data;
//   })
//   .catch(error => console.log(error)),