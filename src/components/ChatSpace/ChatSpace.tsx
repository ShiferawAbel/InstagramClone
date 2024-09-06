import { useParams } from "react-router-dom";
import styles from "./ChatSpace.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import { Chat, Message } from "../ChatsList/ChatsList";
import useUserStore from "../../services/userStore";
import sendIcon from "./send-icon.png";
import ChatBox from "./ChatBox";
import { FormEvent, useRef, useState } from "react";

interface FetchChat {
  data: Chat;
}

interface SendMessage {
  message_body: string;
  chat_id: string;
  user_id: number;
  message_id?: number;
}
const ChatSpace = () => {
  const chatId = useParams();
  const queryClient = useQueryClient();
  if (!chatId.id)
    return (
      <div className={styles.chatSpace}>
        <h1>Select Chat</h1>
      </div>
    );

  const messageField = useRef<HTMLInputElement>(null);
  const replyToText = useRef<HTMLInputElement>(null);
  const { mutate: sendMessage } = useMutation({
    mutationFn: (message: SendMessage) =>
      apiClient.post("/messages", message).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["chats", chatId.id]);
      if (messageField.current) {
        messageField.current.value = "";
      }
      const chatMessages = document.getElementById("chatMessages");
      if (chatMessages) {
        window.scrollTo({
          top: chatMessages.scrollHeight,
          behavior: "smooth",
        });
      }
    },
  });
  const [selectedReply, setSelectedReply] = useState<Message | undefined>();
  const authUser = useUserStore.getState().user;
  const { data } = useQuery({
    queryKey: ["chats", chatId.id],
    queryFn: () =>
      apiClient
        .get<FetchChat>(`/chats/${chatId.id}`)
        .then((res) => res.data.data),
  });

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

  return (
    <div className={styles.chatSpace}>
      <div className={styles.chatHeader}>
        <div className={styles.profilePictureContainer}>
          <img
            src={data?.users.find((user) => user.id != authUser.id)?.profileUrl}
            alt=""
          />
        </div>
        <div className={styles.chatWithDesc}>
          <div className="chatWithUserName">
            {data?.users.find((user) => user.id != authUser.id)?.userName}
          </div>
          <div className={styles.activityStatus}>active 6 mins ago</div>
        </div>
      </div>
      <div className={styles.chatMessages} id="chatMessages">
        {data?.messages?.map((message) => (
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
                {data?.users.find((user) => user.id !== authUser.id)?.userName}
              </div>
              <div className={styles.replyMessage}>
                {selectedReply.messageBody}
              </div>
            </div>
            <button className={styles.hideReply} onClick={() => setSelectedReply(undefined)}>X</button>
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
    </div>
  );
};

export default ChatSpace;
