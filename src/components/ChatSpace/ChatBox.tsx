import React from "react";
import { Message } from "../ChatsList/ChatsList";
import styles from "./ChatSpace.module.css";
import useUserStore from "../../services/userStore";
import timeGap from "../../hooks/timeGap";
import replyIcon from "./reply-icon.png";
interface ChatBoxProps {
  message: Message;
  onReply: (message: Message) => void;
}
const ChatBox = ({ message, onReply }: ChatBoxProps) => {
  const authUser = useUserStore.getState().user;
  const handleHover = () => {
    const messageAction = document.getElementById(`messageAction${message.id}`);
    if (messageAction) {
      messageAction.classList.add(styles.showAction);
    }
  };

  const handleHoverOff = () => {
    const messageAction = document.getElementById(`messageAction${message.id}`);
    if (messageAction) {
      messageAction.classList.remove(styles.showAction);
    }
  };
  return (
    <>
      {message.user.id !== authUser.id ? (
        <div
          className={styles.othersText}
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOff}
        >
          <div className={styles.othersProfileContainer}>
            <img src={message.user.profileUrl} alt="" />
          </div>
          <div className={styles.messageBox}>
            {message.replyTo && (
              <div className={styles.replyBox}>
                <div className={styles.repliedTo}>
                  {message.replyTo.user.userName}
                </div>
                <div className={styles.replyMessage}>
                  {message.replyTo.messageBody}
                </div>
              </div>
            )}

            <div className={styles.messageBody}>{message.messageBody}</div>
            <div className={styles.messageFooter}>
              {timeGap(message.sentAt)}
            </div>
          </div>
          <div
            className={styles.messageAction}
            id={`messageAction${message.id}`}
          >
            <img
              src={replyIcon}
              alt=""
              onClick={() => {
                onReply(message);
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className={styles.usersText}
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverOff}
        >
          <div className={styles.messageAction} id={`messageAction${message.id}`}>
            <img src={replyIcon} alt="" onClick={() => {onReply(message)}}/>
          </div>
          <div className={styles.messageBox}>
            {message.replyTo && (
              <div className={styles.replyBox}>
                <div className={styles.repliedTo}>
                  {message.replyTo.user.userName}
                </div>
                <div className={styles.replyMessage}>
                  {message.replyTo.messageBody}
                </div>
              </div>
            )}

            <div className={styles.messageBody}>{message.messageBody}</div>
            <div className={styles.messageFooter}>
              {timeGap(message.sentAt)}
            </div>
          </div>
          <div className={styles.usersProfileContainer}>
            <img src={message.user.profileUrl} alt="" />
          </div>
        </div>
      )}
      {/* {message.messageBody} */}
    </>
  );
};

export default ChatBox;
