import styles from "./posts.module.css";
import testImg from "./tester.jpg";
import notificationImg from "./notification.png";
import commentImg from "./comment.png";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Comments from "./Comments";
import { Post } from "../../hooks/usePosts";
import saveImg from './save.png';
export interface User {
  id: number;
  name: string;
  profileUrl: string;
  email: string;
  userName: string;
  followerNumber: number;
  followingNumber: number;
  following: number;
  followers: User[];
  posts: Post[];
}

interface PostProps {
  post: Post;
}

const PostCard = ({ post }: PostProps) => {
  const [showComment, setShowComment] = useState(false);

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.profileContainer}>
          <div className={styles.profilePictureContainer}>
            <img
              src={post.user.profileUrl}
              className={styles.profilePicture}
              alt=""
            />
          </div>
          <div className={styles.userNameContainer}>
            {post.user.userName} . 15h
          </div>
        </div>
        <div className={styles.moreOptionsContainer}>more</div>
      </div>
      <div className={styles.postContent}>
        <img src={post.fileUrl} className={styles.postImg} alt="" />
      </div>
      <div className={styles.postInteractions}>
        <div className={styles.likeBtn}>
          <img
            src={notificationImg}
            alt=""
            className={styles.interactionImage}
          />
        </div>
        <div className={styles.savePost}>
          <img
            src={saveImg}
            alt=""
            className={styles.interactionImage}
          />
        </div>
      </div>
      <div className={styles.postCaption}>
        <div className={styles.profileContainer}>
          <div className={styles.profilePictureContainer}>
            <img
              src={post.user.profileUrl}
              className={styles.profilePicture}
              alt=""
            />
          </div>
          <div className={styles.userNameContainer}>
            {post.uploadedBy}{" "}
            <span className={styles.caption}>{post.caption}</span>
          </div>
        </div>
      </div>
      {showComment ? (
        <Comments post={post} onHideComment={() => setShowComment(false)} />
      ) : (
        <div
          className={styles.postComment}
          onClick={() => setShowComment(true)}
        >
          view all comments
        </div>
      )}
    </div>
  );
};

export default PostCard;
