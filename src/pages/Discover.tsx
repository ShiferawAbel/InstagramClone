import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";
import { getCsrfToken } from "./Login";
import { User } from "../components/Posts/PostCard";
import { Link } from "react-router-dom";
import { FetchAuthUser } from "./Layout";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import LoadingBar from "../components/LoadingBar";

interface FetchUsersList {
  data: User[];
}

interface InteractionInterface {
  id: number;
  interactionType: "follow" | "unfollow";
}

const Discover = () => {
  const queryClient = useQueryClient();
  const csrfToken = getCsrfToken();
  const { collapsed, setCollapsed } = useNavBarProperties();
  useEffect(() => {
    if (collapsed == true) {
    setCollapsed(false);
    }  
  })
  const { data: authUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () =>
      await axios
        .get<FetchAuthUser>("http://localhost:8000/api/v1/user", {
          params: {
            followers: true,
            following: true,
          },
          headers: {
            accept: "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        })
        .then((res) => {
          return res.data.user;
        }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios
        .get<FetchUsersList>("http://localhost:8000/api/v1/users", {
          params: {
            followers: true,
            following: true,
          },
          headers: {
            Accept: "application/json",
            "XSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
        })
        .then((res) => res.data.data);
      return response;
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const { mutate, isLoading: interactionLoading } = useMutation({
    mutationFn: async ({ id, interactionType }: InteractionInterface) =>
      axios
        .post(
          `http://localhost:8000/api/v1/${interactionType}/${id}`,
          {},
          {
            headers: {
              "XSRF-TOKEN": csrfToken,
              Accept: "application/json",
            },
            withCredentials: true,
            withXSRFToken: true,
          }
        )
        .then((res) => {
          queryClient.invalidateQueries(["users"]);
        }),
  });

  const interaction = (id: number, interactionType: string) => {
    mutate({ id, interactionType } as InteractionInterface);
  };
  return (
    <>
      { isLoading && <LoadingBar /> }
      <div className="find-friends-box">
        <h1>Find new friends to follow</h1>
        {interactionLoading && <LoadingBar />}
        {isLoading
          ? "Loading..."
          : data?.map((user) => (
              <div className="user-box" key={user.id}>
                <Link to={"/user/" + user.id} className="to-profile">
                  <div className="account-details">
                    <div className="profile-img-friend">
                      <img src={user.profileUrl} alt="" />
                    </div>
                    <div className="name-status">
                      <div className="div">{user.userName}</div>
                      <div className="status">
                        1 post {user.followerNumber} followers{" "}
                        {user.followingNumber} following
                      </div>
                    </div>
                  </div>
                </Link>
                <div
                  className="follow-btn"
                  style={{ cursor: "pointer" }}
                  id="interactions"
                >
                  {user.followers?.find((user) => user.id == authUser?.id) ? (
                    <span onClick={() => interaction(user.id, "unfollow")}>
                      Unfollow
                    </span>
                  ) : (
                    <span onClick={() => interaction(user.id, "follow")}>
                      Follow
                    </span>
                  )}
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Discover;
