"use client";

import "@mantine/core/styles.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ColorSchemeScript, MantineProvider, createTheme, Input } from "@mantine/core";
// import { authStore, user } from "@/store/auth";
// import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { login, isLoggedIn } = authStore();

  // useEffect(() => {
  //   if (isLoggedIn){
  //     return () => {
  //       null
  //   }
  //   } else {
  //     // initializeFromLocalStorage();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoggedIn, login]);

  // useEffect(() => {
  //   initializeFromLocalStorage();
  // }, [initializeFromLocalStorage]);

  const theme = createTheme({
    components: {
      Input: Input.extend({
        defaultProps: {
          variant: "filled",
          radius: "md",
          size: "md",
          w: "100%",
        },
        classNames: {input: "focus:outline-none bg-[#ececec] border-gray-300 w-full focus:border-black rounded-lg w-full"},
      }),

      InputWrapper: Input.Wrapper.extend({
        defaultProps: {
          inputWrapperOrder: ["label", "input", "description", "error"],
        },
      }),
    },
  });

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">{children}</MantineProvider>
      </body>
    </html>
  );
}
