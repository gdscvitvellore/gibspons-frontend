import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  username: string;
  loginPreference: boolean;
  id: number;
  organisation: string | null;
  profile_pic: string | null;
  is_approved: boolean;
  role: "user" | "admin" | "owner" | null;
  accessToken: string;
  refreshToken: string;
}

interface AuthStore extends User {
  isLoggedIn: boolean;
  getUser: () => User;
  update: (_props: User) => void;
  login: (_props: User) => void;
  logout: () => void;
}

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      name: "",
      email: "",
      username: "",
      organisation: null,
      role: null,
      loginPreference: false,
      id: NaN,
      accessToken: "",
      profile_pic: null,
      refreshToken: "",
      is_approved: false,
      isLoggedIn: false,
      getUser: () => {
        return {
          name: get().name,
          email: get().email,
          username: get().username,
          loginPreference: get().loginPreference,
          id: get().id,
          profile_pic: get().profile_pic,
          organisation: get().organisation,
          role: get().role,
          is_approved: get().is_approved,
          accessToken: get().accessToken,
          refreshToken: get().refreshToken,
        };
      },
      update: (props: User) => {
        set({ ...props });
      },
      login: (props: User) => {
        set({ ...props, isLoggedIn: true });
      },
      logout: () => {
        set({
          name: "",
          email: "",
          username: "",
          loginPreference: false,
          profile_pic: null,
          id: NaN,
          organisation: null,
          role: null,
          accessToken: "",
          refreshToken: "",
          isLoggedIn: false,
        });
          localStorage.clear();
      },
    }),
    {
      name: "authStore",
    }
  )
);
