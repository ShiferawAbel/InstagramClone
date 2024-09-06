import React from "react";
import styles from "./ChatsList.module.css";
import testImg from "./tester.jpg";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { User } from "../Posts/PostCard";
import useUserStore from "../../services/userStore";
import { Link } from "react-router-dom";

export interface Message {
  id: number;
  messageBody: string;
  replyTo?: Message;
  sentAt: string;
  user: User;
}
export interface Chat {
  id: number;
  type: string;
  users: User[];
  lastMessage: Message;
  messages?: Message[];
}
interface FetchChatlist {
  data: Chat[];
}
const ChatsList = () => {
  const authUser = useUserStore.getState().user;
  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      apiClient.get<FetchChatlist>("/chats").then((res) => res.data.data),
  });
  return (
    <div className={styles.chatsList}>
      <h1>All Chats</h1>
      {data?.map((chat) => (
        <Link className={styles.chatLink} key={chat.id} to={`/messages/${chat.id}`}>
          <div className={styles.chatInstance}>
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
              <div className={styles.lastMessage}>{chat.lastMessage.user.id !== authUser.id ? chat.lastMessage.user.userName + ':' : 'You:'} { chat.lastMessage.messageBody }</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatsList;
