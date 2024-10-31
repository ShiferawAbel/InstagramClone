import React, { useEffect } from "react";
import styles from "./ChatsList.module.css";
import testImg from "./tester.jpg";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { User } from "../Posts/PostCard";
import useUserStore from "../../services/userStore";
import { Link } from "react-router-dom";
import { Chat } from "../../hooks/useChat";
import LoadingBar from "../LoadingBar";
import useCurrentChat from "../../services/CurrentChatStore";

export interface Message {
  id: number;
  messageBody: string;
  replyTo?: Message;
  sentAt: string;
  user: User;
}

interface FetchChatlist {
  data: Chat[];
}
const ChatsList = () => {
  const authUser = useUserStore.getState().user;
  const {chatId} = useCurrentChat();
  console.log(chatId)
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () =>
      apiClient.get<FetchChatlist>("/chats").then((res) => res.data.data),
  });
  return (
    <div className={styles.chatsList} id="chatsList">
      {isLoading && <LoadingBar />}
      <h1>All Chats</h1>
      {data?.map((chat) => chat.lastMessage && (
        <Link className={styles.chatLink} key={chat.id} to={`/messages/${chat.id}`}>
          <div className={chatId === chat.id ? styles.selectedChat : styles.chatInstance}>
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
