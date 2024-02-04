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
  const { login, isLoggedIn, initializeFromLocalStorage } = authStore();

  useEffect(() => {
    if (isLoggedIn){
      return () => {
        null
    }
    } else {
      initializeFromLocalStorage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, login]);

  useEffect(() => {
    initializeFromLocalStorage();
  }, [initializeFromLocalStorage]);

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
