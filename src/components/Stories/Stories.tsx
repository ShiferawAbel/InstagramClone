import { FormEvent, useRef, useState } from "react";
import styles from "./stories.module.css";
import deleteImg from "../Posts/delete.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../services/apiClient";
import LoadingBar from "../LoadingBar";
import { User } from "../Posts/PostCard";
import useUserStore from "../../services/userStore";
interface NoteSubmit {
  note: string;
}

interface UserWithNotes {
  data: User[];
}

export interface Note {
  id: number;
  note: string;
}
const Stories = () => {
  const queryClient = useQueryClient();
  const noteField = useRef<HTMLInputElement | null>(null);
  const { user } = useUserStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async (note: NoteSubmit) => {
      await apiClient.post(`/notes`, note);
      await queryClient.invalidateQueries(["user"]);
    },
    onSuccess: () => {
      if (noteField.current) {
        noteField.current.value = "";
      }
    },
  });
  const { data: followings } = useQuery<User[]>({
    queryKey: ["notes"],
    queryFn: () =>
      apiClient.get<UserWithNotes>("/notes").then((res) => res.data.data),
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (noteField.current?.value) {
      mutate({
        note: noteField.current.value,
      });
    }
  };
  const deleteNote = async (id: number) => {
    setIsDeleting(true);
    await apiClient.delete(`/notes/${id}`);
    await queryClient.invalidateQueries(["user"]);
    setIsDeleting(false);
  };
  return (
    <div className={styles.storiesList}>
      <div className={styles.storyContainer}>
        <div className={styles.storyProfileContainer}>
          <img
            className={styles.storyProfilePicture}
            src={user.profileUrl}
            alt=""
          />
        </div>
        <div className={styles.storyUserName}>{user.userName}</div>
        {isLoading && <LoadingBar />}
        {user.note?.length === 0 ? (
          <div className={styles.note}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                placeholder="Any Note..."
                className={styles.noteField}
                type="text"
                ref={noteField}
              />
              <input type="submit" className={styles.shareBtn} />
            </form>
          </div>
        ) : (
          user.note?.map((note) => (
            <div key={note.id} className={styles.note}>
              {isDeleting && <LoadingBar />}
              {note.note}
              <button
                className={styles.deleteBtn}
                onClick={() => deleteNote(note.id)}
              >
              <img src={deleteImg} className={styles.deleteIcon} alt="" />
              </button>
            </div>
          ))
        )}
      </div>
      {followings?.map((user) => {
        return (
          user.note?.length !== 0 &&
          user.note?.map((note) => (
            <div className={styles.storyContainer} key={note.id}>
              <div className={styles.storyProfileContainer}>
                <img
                  className={styles.storyProfilePicture}
                  src={user.profileUrl}
                  alt=""
                />
              </div>
              <div className={styles.storyUserName}> {user.userName} </div>
              <div className={styles.note}> {note.note} </div>
            </div>
          ))
        );
      })}
    </div>
  );
};

export default Stories;