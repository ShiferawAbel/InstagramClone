import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "../profile.module.css";
import { getCsrfToken } from "./Login";
import { FetchAuthUser } from "./Layout";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import { useEffect } from "react";
import LoadingBar from "../components/LoadingBar";
import { Link } from "react-router-dom";

const UserProfilePage = () => {
  //   const user = useUserStore.getState().user;
  const { collapsed, setCollapsed } = useNavBarProperties();
  useEffect(() => {
    if (collapsed == true) {
    setCollapsed(false);
    }  
  })
  const csrfToken = getCsrfToken();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", "posts"],
    queryFn: async () =>
      await axios
        .get<FetchAuthUser>("http://localhost:8000/api/v1/user", {
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
        .then((res) => res.data.user),
  });
  console.log(user);
  return (
    <div className={styles.profile}>
      {isLoading ? (
        <LoadingBar />
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
                <Link to="/edit-profile">Edit</Link>
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

export default UserProfilePage;
