import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useRef } from "react";
import { getCsrfToken } from "./Login";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";

interface UserSubmit {
  name: string;
  profileUrl: File | null;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);

  const { mutate, isLoading, error } = useMutation<
    UserSubmit,
    Error,
    UserSubmit
  >({
    mutationFn: async (user: UserSubmit) => {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
      const csrfToken = getCsrfToken();
      console.log(user.profileUrl);
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("user_name", user.userName);
      formData.append("password", user.password);
      formData.append("password_confirmation", user.confirmPassword);
      if (user.profileUrl) {
        formData.append("profile_url", user.profileUrl); // Ensure this matches the expected key in your backend
      }

      await axios
        .post<UserSubmit>("http://localhost:8000/api/register", formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": csrfToken,
          },
          withCredentials: true,
          withXSRFToken: true,
        })
        .then((res) => res.data);
      return user;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      name.current?.value &&
      email.current?.value &&
      userName.current?.value &&
      password.current?.value &&
      confirmPassword.current?.value
    ) {
      mutate({
        name: name.current.value,
        email: email.current.value,
        userName: userName.current.value,
        password: password.current.value,
        confirmPassword: confirmPassword.current.value,
        profileUrl: file.current?.files ? file.current.files[0] : null,
      });
    }
  };

  return (
    <div className="center-form-div loginform">
      {isLoading && <LoadingBar />}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h1>Sign Up</h1>
        {error && error.response.data.message}
        <input
          ref={name}
          className="text-field"
          type="text"
          placeholder="Name"
          name="name"
        />
        <input
          ref={email}
          className="text-field"
          type="email"
          placeholder="Email"
          name="email"
        />
        <input
          ref={userName}
          className="text-field"
          type="text"
          placeholder="User Name"
          name="user_name"
        />
        <input
          ref={password}
          className="text-field"
          type="password"
          name="password"
          placeholder="Password"
        />
        <input
          ref={confirmPassword}
          className="text-field"
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
        />
        <input
          ref={file}
          type="file"
          name="profile_url"
          placeholder="Choose profile pic"
          className="file-field"
        />
        <button type="submit">{isLoading ? "Signing Up..." : "Sign Up"}</button>
      </form>
    </div>
  );
};

export default Register;
