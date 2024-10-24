import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { getCsrfToken } from "./Login";
import { User } from "../components/Posts/PostCard";
import { Link } from "react-router-dom";
import { FetchAuthUser } from "./Layout";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import LoadingBar from "../components/LoadingBar";
import useUserStore from "../services/userStore";
import useInteractions, {
  InteractionInterface,
} from "../hooks/useInteractions";

interface FetchUsersList {
  data: User[];
}

const Discover = () => {
  const queryClient = useQueryClient();
  const searchQuery = useRef<HTMLInputElement>(null);
  const csrfToken = getCsrfToken();
  const { user: authUser } = useUserStore();
  const { collapsed, setCollapsed } = useNavBarProperties();

  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (collapsed == true) {
      setCollapsed(false);
    }
  });
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios
        .get<FetchUsersList>("http://localhost:8000/api/v1/users", {
          params: {
            followers: true,
            following: true,
            searchQuery: searchQuery.current?.value,
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
      // console.log(data);
    },
  });

  const { mutate, isLoading: interactionLoading } = useInteractions();

  const interaction = (id: number, interactionType: string) => {
    mutate({
      id,
      interactionType,
      invalidate: "users",
    } as InteractionInterface);
  };
  return (
    <>
      {isLoading && <LoadingBar />}
      {interactionLoading && <LoadingBar />}
      <div className="find-friends-box">
        <h1>Find new friends to follow</h1>
        <input
          className="searchQueryField"
          placeholder="Search For Friends Here.."
          ref={searchQuery}
          type="text"
          onChange={async () => {
            setIsSearching(true);
            await queryClient.invalidateQueries(["users"]);
            setIsSearching(false);
          }}
        />
        {isLoading
          ? "Loading..."
          : isSearching
          ? "Searching..."
          : data?.length == 0 ? "No results for '" + searchQuery.current?.value + "'" : data?.map((user) => (
              <div className="user-box" key={user.id}>
                <Link to={"/user/" + user.id} className="to-profile">
                  <div className="account-details">
                    <div className="profile-img-friend">
                      <img src={user.profileUrl} alt="" />
                    </div>
                    <div className="name-status">
                      <div className="div">{user.userName}</div>
                      <div className="status">
                        {user.posts.length} post {user.followerNumber} followers{" "}
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
                    <button
                      onClick={() => interaction(user.id, "unfollow")}
                      className="interact"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => interaction(user.id, "follow")}
                      className="interact"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Discover;
