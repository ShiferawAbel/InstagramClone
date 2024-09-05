import React from "react";
import styles from "./ChatsList.module.css";
import testImg from "./tester.jpg";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { User } from "../Posts/PostCard";
import useUserStore from "../../services/userStore";

interface Chat {
  id: number;
  type: string;
  users: User[];
}
interface FetchChat {
  data: Chat[];
}
const ChatsList = () => {
  const authUser = useUserStore.getState().user;
  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      apiClient.get<FetchChat>("/chats").then((res) => res.data.data),
  });
  return (
    <div className={styles.chatsList}>
      <h1>All Chats</h1>
      {data?.map((chat) => (
        <div key={chat.id} className={styles.chatInstance}>
          <div className={styles.chatWithProfile}>
            <div className={styles.profilePictureContainer}>
              <img
                src={
                  chat.users.find((user) => user.id != authUser.id)?.profileUrl
                }
                className={styles.profilePicture}
                alt=""
              />
            </div>
          </div>
          <div className={styles.chatDesc}>
            <div className={styles.chatUserName}>{chat.users.find((user) => user.id != authUser.id)?.userName}</div>
            <div className={styles.lastMessage}>i am a brave boy right</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatsList;
