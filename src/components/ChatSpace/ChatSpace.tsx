import { useParams } from "react-router-dom";
import styles from "./ChatSpace.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { Message } from "../ChatsList/ChatsList";
import useUserStore from "../../services/userStore";
import sendIcon from "./send-icon.png";
import ChatBox from "./ChatBox";
import { FormEvent, useEffect, useRef, useState } from "react";
import useSendMessage from "../../hooks/useSendMessage";
import useChat from "../../hooks/useChat";
import LoadingBar from "../LoadingBar";
import chatsStyles from '../ChatsList/ChatsList.module.css'

const ChatSpace = () => {
  const chatId = useParams();

  if (!chatId.id)
    return (
      <div className={styles.chatSpace}>
        <h1>Select Chat</h1>
      </div>
    );

  const { data: chat, isLoading } = useChat(parseInt(chatId.id));

  const { mutate: sendMessage, isLoading: isSending } = useSendMessage(parseInt(chatId.id), () => {
    if (messageField.current) {
      messageField.current.value = "";
    }
  });

  const [selectedReply, setSelectedReply] = useState<Message | undefined>();

  const messageField = useRef<HTMLInputElement>(null);
  
  const authUser = useUserStore.getState().user;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (messageField.current?.value) {
      if (chatId.id) {
        sendMessage({
          message_body: messageField.current?.value,
          user_id: authUser.id,
          chat_id: chatId.id,
          message_id: selectedReply?.id || undefined,
        });
      }
    }
  };
  useEffect(() => {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  })
  useEffect(() => {
    if (document.getElementById('chatsList')) {
      if (chatId.id) {
        document.getElementById('chatsList').className = chatsStyles.chatsList + ' hide';
      } else {
        document.getElementById('chatsList').className = chatsStyles.chatsList;
      }
    }
  }, chatId.id ? [chatId.id] : [] )
  return (
    <>
      <div className={`${styles.chatSpaceSelected}`}>
        {isLoading ? (
          <div className="spinner-grow text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) :
        <>
          <div className={styles.chatHeader}>
            <div className={styles.profilePictureContainer}>
              <img
                src={
                  chat?.users.find((user) => user.id != authUser.id)?.profileUrl
                }
                alt=""
              />
            </div>
            <div className={styles.chatWithDesc}>
              <div className="chatWithUserName">
                {chat?.users.find((user) => user.id != authUser.id)?.userName}
              </div>
              <div className={styles.activityStatus}>active 6 mins ago</div>
            </div>
          </div>
          <div className={styles.chatMessages} id="chatMessages">
            { isSending && <LoadingBar /> }
            {chat?.messages?.map((message) => (
              <ChatBox
                onReply={(message) => setSelectedReply(message)}
                message={message}
              />
            ))}
          </div>
          <div className={styles.chatNewMessage}>
            {selectedReply && (
              <div className={styles.selectedReply}>
                <div className={styles.replyWhatever}>
                  <div className={styles.replyDesc}>
                    replying to{" "}
                    {
                      chat?.users.find((user) => user.id !== authUser.id)
                        ?.userName
                    }
                  </div>
                  <div className={styles.replyMessage}>
                    {selectedReply.messageBody}
                  </div>
                </div>
                <button
                  className={styles.hideReply}
                  onClick={() => setSelectedReply(undefined)}
                >
                  X
                </button>
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                ref={messageField}
                placeholder="Write Your Message Here..."
                className={styles.messageField}
                type="text"
              />
              <button className={styles.sendBtn} type="submit">
                <img src={sendIcon} alt="" />
              </button>
            </form>
          </div>
        </>
        }
      </div>
    </>
  );
};

export default ChatSpace;
