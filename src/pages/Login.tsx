import axios from "axios";
import React, { FormEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { User } from "../components/Posts/PostCard";
import useUserStore from "../services/userStore";
import useIsLoggedOut from "../services/loggedOutStore";
import LoadingBar from "../components/LoadingBar";

export const getCsrfToken = (): string | undefined => {
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));
  return csrfCookie ? csrfCookie.split("=")[1] : undefined;
};

interface Credentials {
  email: string | undefined;
  password: string | undefined;
}

interface FetchLogin {
  message: string;
  user: User; 
}

const login = async (credentials: Credentials): Promise<User> => {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });

  const csrfToken = getCsrfToken();
  const response = await axios.post<FetchLogin>("http://localhost:8000/api/login", credentials, {
    headers: {
      accept: "application/json",
      "X-XSRF-TOKEN": csrfToken,
    },
    withXSRFToken: true,
    withCredentials: true,
  });

  return response.data.user;
};

const Login = () => {
  // const { setCsrfToken } = useCsrfStore();
  const {user, setUser} = useUserStore();
  const { setIsLoggedOut } = useIsLoggedOut();
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation<User, Error, Credentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setIsLoggedOut(false);
      navigate('/');
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const credentials = {
      email: email.current?.value,
      password: password.current?.value,
    };

    mutate(credentials);
  };

  return (
    <>
      { isLoading && <LoadingBar /> }
      <div className="center-form-div loginform">
        <form onSubmit={handleSubmit}>
          <h1>Log In</h1>
          {error && error.response.data.message}
          <input ref={email} className="text-field" type="email" placeholder="email" name="email" />
          <input ref={password} className="text-field" type="password" placeholder="Password" name="password" />
          <button type="submit">{isLoading ? 'Logging In...' : 'Log In'}</button>
        </form>
        <p>Not registered yet? <Link to='/register'>register</Link></p>
      </div>
    </>
  );
};

export default Login;
