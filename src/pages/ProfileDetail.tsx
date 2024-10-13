import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "../profile.module.css";
import { getCsrfToken } from "./Login";
import { Link, useNavigate, useParams } from "react-router-dom";
import { User } from "../components/Posts/PostCard";
import apiClient from "../services/apiClient";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import { useEffect, useState } from "react";
import LoadingBar from "../components/LoadingBar";
import PopUp from "../components/PopUp/PopUp";
import useUserStore from "../services/userStore";
import useInteractions, { InteractionInterface } from "../hooks/useInteractions";

interface FetchUser {
  user: User;
  chatCommon: number | null;
}

interface NewChat {
  with_user: number;
}

const ProfileDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const csrfToken = getCsrfToken();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const { collapsed, setCollapsed } = useNavBarProperties();
  const { mutate: interact, isLoading: interacting } = useInteractions();
  const { user: authUser } = useUserStore();
  const interaction = (id: number, interactionType: 'follow' | 'unfollow') => {
    if (data) {
      interact({ id, interactionType, invalidate: data?.user.id});
    }
  };
  useEffect(() => {
    if (collapsed == true) {
      setCollapsed(false);
    }
  });
  useEffect(() => {
    if (showFollowers) {
      setShowFollowers(false);
    }

    if (showFollowing) {
      setShowFollowing(false);
    }
  }, [id]);
  // useEffect(() => {
  //   if (condition) {

  //   }
  // })
  const { data, isLoading } = useQuery({
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
        .then((res) => res.data),
  });
  const { mutate: newChat, isLoading: creatingChat } = useMutation({
    mutationFn: (chat: NewChat) =>
      apiClient.post("/chats", chat).then((res) => res.data.data),
    onSuccess: (ss) => {
      navigate(`/messages/${ss}`);
    },
  });
  console.log(showFollowing);
  const startNewChat = () => {
    if (id) {
      newChat({ with_user: parseInt(id) });
    }
  };
  return (
    <>
      {showFollowers && data?.user.followers && (
        <PopUp
          popUpType="FOLLOWERS"
          users={data.user.followers}
          onCancel={() => setShowFollowers(false)}
          userId={data.user.id}
          />
        )}
      {showFollowing && data?.user.following && (
        <PopUp
          popUpType="FOLLOWING"
          users={data.user.following}
          onCancel={() => setShowFollowing(false)}
          userId={data.user.id}
        />
      )}
      <div className={styles.profile}>
        {creatingChat && <LoadingBar />}
        {isLoading ? (
          <LoadingBar />
        ) : (
          <div className={styles.profileDetailBox}>
            <div className={styles.profilePictureShow}>
              <img
                className={styles.profilePagePic}
                src={data?.user?.profileUrl}
                alt=""
              ></img>
            </div>
            <div className={styles.accountDesc}>
              <div className={styles.accountConfig}>{data?.user.userName}</div>
              <div className={styles.accountSocialStatus}>
                <div className={styles.numberOfPost}>
                  <span className={styles.descNumb}>
                    {data?.user.posts ? data?.user.posts.length : 0}
                  </span>{" "}
                  Posts
                </div>
                <div className={styles.followers}>
                  <span className={styles.descNumb}>
                    {data?.user?.followerNumber}
                  </span>{" "}
                  <span onClick={() => setShowFollowers(true)}>followers</span>
                </div>
                <div className={styles.following}>
                  <span className={styles.descNumb}>
                    {data?.user?.followingNumber}
                  </span>{" "}
                  <span onClick={() => setShowFollowing(true)}>following</span>
                </div>
              </div>
              <div className={styles.profileOptions}>
                {interacting && <LoadingBar />}
                {data &&
                  (data.user.followers?.filter(
                    (follower) => follower.id === authUser.id
                  ).length > 0 ? (
                    <button
                      onClick={() => interaction(data.user.id, "unfollow")}
                      className={styles.interact}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => interaction(data.user.id, "follow")}
                      className={styles.interact}
                    >
                      Follow
                    </button>
                  ))}
                <div className={styles.messageEdit}>
                  {data?.chatCommon ? (
                    <Link className={styles.messageBtn} to={`/messages/${data.chatCommon}`}>Message</Link>
                  ) : (
                    <button
                      onClick={() => startNewChat()}
                      className={styles.messageBtn}
                    >
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={styles.allUserPosts}>
          {data?.user?.posts &&
            data.user.posts.map((post) => (
              <Link to={`/post/${post.id}`}>
                <div key={post.id} className={styles.profilePost}>
                  <img src={post.fileUrl} alt="" />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;
