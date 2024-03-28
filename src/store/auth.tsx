import { create } from "zustand";

export interface user {
  name: string;
  email: string;
  loginPreference: boolean;
  id: number;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthStore {
  name: string;
  email: string;
  loginPreference: boolean;
  id: number;
  accessToken: string | null;
  refreshToken: string | null;
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
    const data: user = JSON.parse(localStorage.getItem("user") || "{}");

    const { name, email, loginPreference, id, accessToken, refreshToken } =
      data;

    if (
      name &&
      email &&
      typeof loginPreference !== undefined &&
      id &&
      accessToken &&
      refreshToken
    ) {
      set(() => ({
        name: name,
        email: email,
        loginPreference: loginPreference,
        id: id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isLoggedIn: true,
      }));
    }
  },
}));
