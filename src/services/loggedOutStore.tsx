import { create } from "zustand";

interface IsLoggedOutInterface {
  isLoggedOut: boolean;
  setIsLoggedOut: (loggedOut: boolean) => void;
}

const useIsLoggedOut = create<IsLoggedOutInterface>(set => ({
  isLoggedOut: false,
  setIsLoggedOut: (loggedOut) => set(store => ({isLoggedOut: loggedOut}))
}))

export default useIsLoggedOut