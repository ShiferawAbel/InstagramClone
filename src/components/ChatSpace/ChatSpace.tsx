import styles from './ChatSpace.module.css'

const ChatSpace = () => {

  return (
    <div className={styles.chatSpace}>
      <h1>All Chats</h1>
      <div className={styles.chatInstance}>
        <div className={styles.chatWithProfile}>
          <div className={styles.profilePictureContainer}>
            <img src="test" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSpace