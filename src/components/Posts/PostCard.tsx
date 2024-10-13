import styles from "./posts.module.css";
import testImg from "./tester.jpg";
import notificationImg from "./notification.png";
import likedImg from "./liked.png";
import commentImg from "./comment.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Comments from "./Comments";
import { Post } from "../../hooks/usePosts";
import saveImg from "./save.png";
import useUserStore from "../../services/userStore";
import apiClient from "../../services/apiClient";
import PopUp from "../PopUp/PopUp";
import timeGap from "../../hooks/timeGap";
import { Link } from "react-router-dom";
import { Note } from "../Stories/Stories";
import deleteIcon from "./delete.png";
import LoadingBar from "../LoadingBar";
export interface User {
  id: number;
  name: string;
  profileUrl: string;
  email: string;
  userName: string;
  followerNumber: number;
  followingNumber: number;
  followers: User[];
  following: User[];
  posts: Post[];
  note?: Note[];
}

interface PostProps {
  post: Post;
}

const PostCard = ({ post }: PostProps) => {
  const [showComment, setShowComment] = useState(false);
  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likedBy.length);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [lastTap, setLastTap] = useState<number>(0);
  const likePost = async () => {
    setLikedByUser(true);
    setNumberOfLikes(numberOfLikes + 1);
    await apiClient.post(`/posts/${post.id}/like`, {});
    await queryClient.invalidateQueries(["posts"]);
  };
  const removeLike = async () => {
    setNumberOfLikes(numberOfLikes - 1);
    setLikedByUser(false);
    queryClient.invalidateQueries(["posts"]);
    await apiClient.post(`/posts/${post.id}/remove-like`, {});
  };

  const handleDoubleTap = (event: React.TouchEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      likedByUser ? removeLike() : likePost();
    }

    setLastTap(currentTime);
  };

  const deletePost = async () => {
    setIsDeleting(true);
    await apiClient.delete(`/posts/${post.id}`);
    await queryClient.invalidateQueries(['posts'])
    setIsDeleting(false);
  };
  return (
    <>
      {isDeleting && <LoadingBar />}
      {showLikedBy && (
        <PopUp
          onCancel={() => setShowLikedBy(false)}
          popUpType="LIKEDBY"
          users={post.likedBy}
          invalidate={[]}
        />
      )}
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
              <Link
                className={styles.userNameLink}
                to={`/user/${post.user.id}`}
              >
                {post.user.userName}
              </Link>{" "}
              . <span className={styles.timeGap}>{timeGap(post.postedAt)}</span>
            </div>
          </div>
          {user.id == post.user.id && (
            <button onClick={deletePost} className={styles.deleteIcon}>
              <img src={deleteIcon} className={styles.deleteImg} alt="" />
            </button>
          )}
        </div>
        <div
          className={styles.postContent}
          onTouchEnd={handleDoubleTap}
          onDoubleClick={() => (likedByUser ? removeLike() : likePost())}
        >
          <img src={post.fileUrl} className={styles.postImg} alt="" />
        </div>
        <div className={styles.postInteractions}>
          <div
            className={styles.likeBtn}
            style={{ width: "35px", marginTop: "5px" }}
          >
            <div className={styles.iconContainer}>
              {likedByUser ? (
                <img
                  onClick={() => removeLike()}
                  src={likedImg}
                  alt=""
                  className={styles.interactionImage}
                />
              ) : (
                <img
                  onClick={() => likePost()}
                  src={notificationImg}
                  alt=""
                  className={styles.interactionImage}
                />
              )}
            </div>
            <div className={styles.likes} onClick={() => setShowLikedBy(true)}>
              {numberOfLikes + " Likes"}
            </div>
          </div>
          <div className={styles.savePost}>
            <img src={saveImg} alt="" className={styles.interactionImage} />
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
              <Link
                className={styles.userNameLink}
                to={`/user/${post.user.id}`}
              >
                <span className={styles.userName}>
                  {post.user.userName + "  "}
                </span>
              </Link>{" "}
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
    </>
  );
};

export default PostCard;
