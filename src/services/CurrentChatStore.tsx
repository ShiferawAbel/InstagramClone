import { create } from "zustand";

interface CurrentChatStoreInterface {
  chatId: number | null;
  setChatId: (chatId: number) => void;
}

const useCurrentChat = create<CurrentChatStoreInterface>(set => ({
  chatId: null,
  setChatId: (chatId) => set(() => ({chatId: chatId}))
}));

export default useCurrentChat