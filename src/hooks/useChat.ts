import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { User } from "../components/Posts/PostCard";
import { Message } from "../components/ChatsList/ChatsList";

interface FetchChat {
  data: Chat;
}

export interface Chat {
  id: number;
  type: string;
  users: User[];
  unread: number;
  lastMessage: Message;
  messages?: Message[];
}
const useChat = (chatId: number) => useQuery({
  queryKey: ["chats", chatId],
  queryFn: () =>
    apiClient
      .get<FetchChat>(`/chats/${chatId}`)
      .then((res) => res.data.data),
});

export default useChat