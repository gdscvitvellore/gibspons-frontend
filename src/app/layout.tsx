"use client";

import "@mantine/core/styles.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { authStore, user } from "@/store/auth";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { login, isLoggedIn } = authStore();

  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const loginPreference = localStorage.getItem("loginPreference");
    const id = localStorage.getItem("id");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (name && email && loginPreference && id && accessToken && refreshToken) {
      const User: user = {
        name: name,
        email: email,
        loginPreference: JSON.parse(loginPreference),
        id: parseInt(id),
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      login(User);
    } else {
      if (!isLoggedIn) {
        console.log("Not logged in");
      } else {
        console.log("Logged in");
      }
    }
  }, [isLoggedIn, login]);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
      </body>
    </html>
  );
}
