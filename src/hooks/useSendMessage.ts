import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

interface SendMessage {
  message_body: string;
  chat_id: string;
  user_id: number;
  message_id?: number;
}

const useSendMessage = (chatId: number, onSend: () => void) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (message: SendMessage) =>{
      await apiClient.post("/messages", message).then((res) => res.data),
      await queryClient.invalidateQueries(["chats", chatId]);
      queryClient.invalidateQueries(["chats"]);},
    onSuccess: () => {
      onSend();
      const chatMessages = document.getElementById("chatMessages");
      if (chatMessages) {
        window.scrollTo({
          top: chatMessages.scrollHeight,
          behavior: "smooth",
        });
      }
    },
  });
  return mutation;
}

export default useSendMessage