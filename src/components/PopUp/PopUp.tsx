import { Link } from "react-router-dom";
import { User } from "../Posts/PostCard";
import styles from "./PopUp.module.css";
import useInteractions from "../../hooks/useInteractions";
import LoadingBar from "../LoadingBar";
import useUserStore from "../../services/userStore";

interface PopUpProps {
  popUpType: "FOLLOWERS" | "FOLLOWING" | "LIKEDBY";
  users: User[];
  onCancel: () => void;
}
const PopUp = ({ popUpType, users, onCancel }: PopUpProps) => {
  const { mutate: interact, isLoading } = useInteractions();
  const { user: authUser } = useUserStore();
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

              {users.map(
                (user) =>
                  user.followers &&
                  user.followers.find((follower) => follower.id == authUser.id)
              ) ? (
                <button className={styles.interact}>unfollow</button>
              ) : (
                <button className={styles.interact}>follow</button>
              )}
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
