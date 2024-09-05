import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "../profile.module.css";
import { getCsrfToken } from "./Login";
import { useParams } from "react-router-dom";
import { User } from "../components/Posts/PostCard";

interface FetchUser {
  data: User;
}

const ProfileDetail = () => {
  const { id } = useParams();
  console.log(id)
  const csrfToken = getCsrfToken();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () =>
      await axios
        .get<FetchUser>("http://localhost:8000/api/v1/user/" + id, {
          params: {
            posts: true,
          },
          headers: {
            accept: "application/json",
            "XSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
          withXSRFToken: true,
        })
        .then((res) => res.data.data),
  });
  console.log(user);
  return (
    <div className={styles.profile}>
      {isLoading ? (
        "loading..."
      ) : (
        <div className={styles.profileDetailBox}>
          <div className={styles.profilePictureShow}>
            <img
              className={styles.profilePagePic}
              src={user?.profileUrl}
              alt=""
            ></img>
          </div>
          <div className={styles.accountDesc}>
            <div className={styles.accountConfig}>{user?.userName}</div>
            <div className={styles.accountSocialStatus}>
              <div className={styles.numberOfPost}>
                <span className={styles.descNumb}>1</span> Posts
              </div>
              <div className={styles.followers}>
                <span className={styles.descNumb}>{user?.followerNumber}</span>{" "}
                followers
              </div>
              <div className={styles.following}>
                <span className={styles.descNumb}>{user?.followingNumber}</span>{" "}
                following
              </div>
            </div>
            <div className={styles.profileOptions}>
              <div className={styles.messageEdit}>
                <a href="/edit/{{ $user->id }}">Edit</a>
              </div>

              <div className={styles.messageEdit}>
                <a href="/startchat/{{ $user->id }}">Message</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.allUserPosts}>
        {user?.posts &&
          user.posts.map((post) => (
            <div key={post.id} className={styles.profilePost}>
              <img src={post.fileUrl} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfileDetail;
