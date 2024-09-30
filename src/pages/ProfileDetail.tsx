import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "../profile.module.css";
import { getCsrfToken } from "./Login";
import { Link, useNavigate, useParams } from "react-router-dom";
import { User } from "../components/Posts/PostCard";
import apiClient from "../services/apiClient";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import { useEffect } from "react";
import LoadingBar from "../components/LoadingBar";

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
  const { collapsed, setCollapsed } = useNavBarProperties();
  useEffect(() => {
    if (collapsed == true) {
    setCollapsed(false);
    }  
  })
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
  const { mutate: newChat, isLoading:creatingChat } = useMutation({
    mutationFn: (chat: NewChat) =>
      apiClient.post("/chats", chat).then((res) => res.data.data),
    onSuccess: (ss) => {
      navigate(`/messages/${ss}`);
    },
  });

  const startNewChat = () => {
    if (id) {
      newChat({ with_user: parseInt(id) });
    }
  };
  return (
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
                followers
              </div>
              <div className={styles.following}>
                <span className={styles.descNumb}>
                  {data?.user?.followingNumber}
                </span>{" "}
                following
              </div>
            </div>
            <div className={styles.profileOptions}>
              <div className={styles.messageEdit}>
                <a href="/edit/{{ $user->id }}">Edit</a>
              </div>

              <div className={styles.messageEdit}>
                {data?.chatCommon ? (
                  <Link to={`/messages/${data.chatCommon}`}>Message</Link>
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
            <div key={post.id} className={styles.profilePost}>
              <img src={post.fileUrl} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfileDetail;
