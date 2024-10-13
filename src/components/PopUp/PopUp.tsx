import { Link } from "react-router-dom";
import { User } from "../Posts/PostCard";
import styles from "./PopUp.module.css";
import useInteractions, { InteractionInterface } from "../../hooks/useInteractions";
import LoadingBar from "../LoadingBar";
import useUserStore from "../../services/userStore";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PopUpProps {
  popUpType: "FOLLOWERS" | "FOLLOWING" | "LIKEDBY";
  users: User[];
  userId?: number;
  onCancel: () => void;
}
const PopUp = ({ popUpType, users, onCancel, userId }: PopUpProps) => {
  const [ interacting, setInteracting ] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: interact, isLoading } = useInteractions();
  const { user: authUser } = useUserStore();
  const interaction = async (id: number, interactionType: "follow" | "unfollow") => {
    setInteracting(true)
    if (userId) {
      interact({ id, interactionType, invalidate: userId });
    } else {
      interact({ id, interactionType, invalidate: "posts" });
    }
    setInteracting(false)
  };
  console.log(users);
  return (
    <div className={styles.backGround}>
      <div className={styles.popUp}>
        <div className={styles.popUpHeader}>
          <h1>
            Liked By{" "}
            <span
              onClick={onCancel}
              style={{ cursor: "pointer", marginLeft: "80px" }}
            >
              X
            </span>
          </h1>
        </div>
        <div className={styles.list}>
          {users.map((user) => (
            <div className={styles.user}>
              <Link className={styles.userLink} to={`/user/${user.id}`}>
                <div className={styles.userDetail}>
                  <div className={styles.profileContainer}>
                    <img src={user.profileUrl} alt="" />
                  </div>
                  <div className={styles.userName}>{user.userName}</div>
                </div>
              </Link>
              {isLoading && <LoadingBar />}
              {user.followers?.filter((follower) =>
                follower.id === authUser.id).length >0  ? (
                  <button onClick={() => interaction(user.id, "unfollow")} className={styles.interact}>Unfollow</button>
                ) : (
                  <button onClick={() => interaction(user.id, "follow")} className={styles.interact}>Follow</button>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
