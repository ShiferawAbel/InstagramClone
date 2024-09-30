import { useQuery } from "@tanstack/react-query";
import styles from "./posts.module.css";
import axios from "axios";
import PostCard from "./PostCard";
import useCsrfStore from "../../services/csrfStore";
import { getCsrfToken } from "../../pages/Login";
import { useEffect } from "react";
import usePosts from "../../hooks/usePosts";
import LoadingBar from "../LoadingBar";


const Posts = () => {
  const {data, isLoading}= usePosts();
  return (
    <div className={styles.posts}>
      { isLoading && <LoadingBar /> }
      {data?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;