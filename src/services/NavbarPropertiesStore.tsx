import { create } from "zustand";

interface NavBarPropertiesInterface {
  collapsed: boolean;
  setCollapsed: (collapse: boolean) => void;
}

const useNavBarProperties = create<NavBarPropertiesInterface>(set => ({
  collapsed: false,
  setCollapsed: (collapse) => set((state) => ({collapsed: collapse}))
}))

export default useNavBarProperties