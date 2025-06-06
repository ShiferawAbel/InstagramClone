import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { FormEvent, useRef } from "react";
import { getCsrfToken } from "./Login";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";

interface NewPost {
  file: File;
  caption: string;
}
const CreatePost = () => {
  const file = useRef<HTMLInputElement>(null);
  const caption = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (post: NewPost) => {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });
      const csrfToken = getCsrfToken();
      const data = new FormData();
      data.append("file_url", post.file);
      data.append("caption", post.caption);

      await axios.post("http://localhost:8000/api/v1/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "XSRF-TOKEN": csrfToken,
        },
        withCredentials: true,
        withXSRFToken: true,
      });
      await queryClient.invalidateQueries(["posts"]);
    },

    onSuccess: () => {
      navigate("/");
    },
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (caption.current?.value && file.current?.files) {
      mutate({
        caption: caption.current?.value,
        file: file.current.files[0],
      });
    } else {
      console.log("erororo");
    }
  };
  return (
    <>
      {isLoading && <LoadingBar />}
      <div className="center-form-div ">
        <h1>New Post</h1>
        <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
          <input
            ref={file}
            type="file"
            className="file-field"
            name="file_url"
            id="file"
          />
          <input
            ref={caption}
            className="text-field"
            type="text"
            placeholder="Caption"
            name="caption"
          />
          {isLoading ? (
            <button disabled>Posting...</button>
          ) : (
            <button type="submit">Post</button>
          )}
        </form>
      </div>
    </>
  );
};

export default CreatePost;
