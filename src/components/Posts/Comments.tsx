import { useState } from "react";
import styles from "./posts.module.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CommentForm from "./CommentForm";
import { getCsrfToken } from "../../pages/Login";
import useComments from "../../hooks/useComments";
import { Post } from "../../hooks/usePosts";
import timeGap from "../../hooks/timeGap";
import { Link } from "react-router-dom";

interface CommentProps {
  post: Post;
  onHideComment: () => void;
}

const Comments = ({ post, onHideComment }: CommentProps) => {
  const { data:comments , isLoading } = useComments(post.id);

  return (
    <div className={styles.commentSection}>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className={styles.commentHeader}>
          <div>AllComments</div>
          <div className={styles.hideComment} onClick={() => onHideComment()}>
            X
          </div>
        </div>
      )}
      <div className={styles.commentsList}>
        {comments?.map((comment) => (
          <div key={comment.id} className={styles.singleComment}>
            <div className={styles.commentProfilePicture}>
              <img src={comment.user.profileUrl} alt="" />
            </div>
            <div className={styles.commentDetail}>
              
              <div className={styles.commenterName}>
              <Link to={`user/${comment.user.id}`}>{comment.user.userName} </Link> <span className={styles.timeGap}>.{timeGap(comment.createdAt)}</span>{" "}
              </div>
              <div className={styles.commentBody}>{comment.commentBody}</div>
            </div>
          </div>
        ))}
      </div>
      <CommentForm post={post} />
    </div>
  );
};

export default Comments;
