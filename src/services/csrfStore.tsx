import { create } from "zustand";

interface CsrfTokenStore {
  csrfToken: string;
  setCsrfToken: (token: string) => void;
}

const useCsrfStore = create<CsrfTokenStore>(set => ({
  csrfToken: '',
  setCsrfToken: (token) => set(() => ({csrfToken: token}))
}))

export default useCsrfStore