// Layout.js
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import useUserStore from "../services/userStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCsrfToken } from "./Login";
import logo from "../../public/iglogo.svg";
import { User } from "../components/Posts/PostCard";
import useNavBarProperties from "../services/NavbarPropertiesStore";
import useIsLoggedOut from "../services/loggedOutStore";
import LoadingBar from "../components/LoadingBar";
import apiClient from "../services/apiClient";
import TopNav from "../components/NavBar/TopNav";

export interface FetchAuthUser {
  user: User;
}

const Layout = () => {
  const { user, setUser } = useUserStore();
  const { collapsed } = useNavBarProperties();
  const navigate = useNavigate();
  const { setIsLoggedOut } = useIsLoggedOut();
  const csrfToken = getCsrfToken();
  const [err, setErr] = useState<Error>();
  const navigation = useNavigation();

  const { data, isLoading } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () =>
      await apiClient
        .get<FetchAuthUser>("http://localhost:8000/api/v1/user")
        .then((res) => {
          return res.data.user;
        }),
    onError: (error) => {
      setErr(error);
    },
    onSuccess: (data) => {
      setUser(data);
    },
    
    retry: 0,
    staleTime: 10000,
  });

  useEffect(() => {
    if (err && err.message === "Request failed with status code 401") {
      setIsLoggedOut(true);
      navigate("/login");
    }
  }, [err, navigate, setIsLoggedOut]);

  
  if (isLoading) {
    return (
      <div className="appLoaderContainer">
        <img className="appLoader" src={logo} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      {collapsed ? (
        <div className="mainPageCollapsed">
          <Outlet />
        </div>
      ) : (
        <div className="mainPage">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Layout;
