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
  initializeFromLocalStorage: () => void;
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
  initializeFromLocalStorage: () => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const loginPreference = localStorage.getItem("loginPreference");
    const id = localStorage.getItem("id");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (name && email && loginPreference && id && accessToken && refreshToken) {
      set({
        name,
        email,
        loginPreference: loginPreference === "true",
        id: parseInt(id),
        accessToken,
        refreshToken,
        isLoggedIn: true,
      });
    }
  },
}));
