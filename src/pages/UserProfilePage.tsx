import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import styles from "../profile.module.css";
import { getCsrfToken } from "./Login";
import { FetchAuthUser } from "./Layout";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import LoadingBar from "../components/LoadingBar";
import { Link } from "react-router-dom";
import avatar from "../assets/avatar.png";
import apiClient from "../services/apiClient";
import PopUp from "../components/PopUp/PopUp";

const UserProfilePage = () => {
  //   const user = useUserStore.getState().user;
  const { collapsed, setCollapsed } = useNavBarProperties();
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const profileUrl = useRef<HTMLInputElement | null>(null);
  const submitBtn = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  useEffect(() => {
    if (collapsed == true) {
      setCollapsed(false);
    }
  });
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

  const updateProfile = async () => {
    setUpdatingProfile(true);
    const formData = new FormData();
    if (profileUrl.current && profileUrl.current.files && profileUrl.current.files[0]) {
      formData.append("profile_url", profileUrl.current.files[0]);
      await apiClient.post(
        `/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      queryClient.invalidateQueries(['user'])
    }
    setUpdatingProfile(false);
  };
  console.log(user?.following)
  return (
    
    <div className={styles.profile}>
      {showFollowers && user?.followers && <PopUp onCancel={() => setShowFollowers(false)} popUpType="FOLLOWERS" users={user?.followers} profile={true}/>}
      {showFollowing && user?.following && <PopUp onCancel={() => setShowFollowing(false)} popUpType="FOLLOWING" users={user?.following} profile={true}/>}
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
            <form id="updateProfilePic" encType="multipart/form-data">
              {updatingProfile && <LoadingBar />}
              <input
                ref={profileUrl}
                type="file"
                name="profile_url"
                id="fileInput"
                onChange={updateProfile}
                hidden
              />
              <button
                type="button"
                id="submitBtn"
                className={styles.avatarBtn}
                ref={submitBtn}
              >
                <img src={avatar} onClick={() => profileUrl.current?.click()} className={styles.avatar} alt="" />
              </button>
            </form>
          </div>
          <div className={styles.accountDesc}>
            <div className={styles.accountConfig}>{user?.userName}</div>
            <div className={styles.accountSocialStatus}>
              <div className={styles.numberOfPost}>
                <span className={styles.descNumb}>1</span> Posts
              </div>
              <div className={styles.followers}>
                <span className={styles.descNumb}>{user?.followerNumber}</span>{" "}
                <span onClick={() => setShowFollowers(true)}>followers</span>
              </div>
              <div className={styles.following}>
                <span className={styles.descNumb}>{user?.followingNumber}</span>{" "}
                <span onClick={() => setShowFollowing(true)}>following</span>
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
            <Link key={post.id} to={`/post/${post.id}`}>
              <div className={styles.profilePost}>
                <img src={post.fileUrl} alt="" />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default UserProfilePage;
