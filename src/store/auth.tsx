import { create } from "zustand";

export interface user {
  name: string;
  email: string;
  loginPreference: boolean;
  id: number;
  accessToken: string;
  refreshToken: string;
}

interface AuthStore extends user {
  isLoggedIn: boolean;
  login: (props: user) => void;
  logout: () => void;
}

export const authStore = create<AuthStore>((set) => ({
  name: "",
  email: "",
  loginPreference: false,
  id: NaN,
  accessToken: "",
  refreshToken: "",
  isLoggedIn: false,
  login: (props: user) => {
    set({ ...props, isLoggedIn: true });
  },
  logout: () =>
    set({
      name: "",
      email: "",
      loginPreference: false,
      id: NaN,
      accessToken: "",
      refreshToken: "",
      isLoggedIn: false,
    }),
}));
