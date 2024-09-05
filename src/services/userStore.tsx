import { create } from "zustand";
import { User } from "../components/Posts/PostCard";
interface UserStore {
  user: User;
  setUser: (user: User | undefined) => void;
}
const useUserStore = create<UserStore>(set => ({
  user: {} as User,
  setUser: (user) => set(() => ({user}))
}))

export default useUserStore