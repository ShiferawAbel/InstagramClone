import React from "react";
import PostCard from "../components/Posts/PostCard";
import { useParams } from "react-router-dom";
import usePost from "../hooks/usePost";
import styles from "../components/Posts/posts.module.css";
import { Post } from "../hooks/usePosts";
import LoadingBar from "../components/LoadingBar";

const ShowPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = usePost(id);
  return (
    <>
      {isLoading && <LoadingBar />}
      <div className={styles.posts}>{post && <PostCard post={post} />}</div>
    </>
  );
};

export default ShowPost;
