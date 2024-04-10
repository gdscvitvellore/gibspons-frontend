import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  loginPreference: boolean;
  id: number;
  organisation: string | null;
  is_approved: boolean;
  role: "user" | "admin" | "owner" | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthStore extends User {
  isLoggedIn: boolean;
  getUser: () => User;
  update: (props: User) => void;
  login: (props: User) => void;
  logout: () => void;
}

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      name: "",
      email: "",
      organisation: null,
      role: null,
      loginPreference: false,
      id: NaN,
      accessToken: "",
      refreshToken: "",
      is_approved: false,
      isLoggedIn: false,
      getUser: () => {
        return {
          name: get().name,
          email: get().email,
          loginPreference: get().loginPreference,
          id: get().id,
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
          loginPreference: false,
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
