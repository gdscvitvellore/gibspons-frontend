"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../styles/globals.css";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  Input,
  PasswordInput,
} from "@mantine/core";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({subsets: ["latin"]});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    fontFamily: "Inter",
    components: {
      Input: Input.extend({
        defaultProps: {
          variant: "filled",
          radius: "md",
          size: "lg",
          w: "100%",
        },
        classNames: {
          input:
            "focus:outline-none bg-white border-[#D0D0D0] w-full focus:border-[#7BB9FA] rounded-lg w-full",
        },
      }),

      PasswordInput: PasswordInput.extend({
        defaultProps: {
          variant: "filled",
          radius: "md",
          size: "md",
          w: "100%",
        },
        classNames: {
          input:
            "focus:outline-none bg-white border-[#D0D0D0] w-full focus:border-[#7BB9FA] rounded-lg w-full",
        },
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
        <link rel="icon" href="/favicon.svg" type="image/svg" sizes="32x32" />

        <meta name="title" content="gibspons" />
        <meta
          name="description"
          content="Gibspons is a platform that helps you track sponsorships"
        />
        <meta name="og:title" content="gibspons" />
        <meta
          name="og:description"
          content="Gibspons is a platform that helps you track sponsorships"
        />
        <title>gibspons</title>
        <meta
          property="og:url"
          content="https://gibspons.dscvit.com"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="gibspons" />
        <meta
          property="og:image"
          content="https://imgur.com/ReuRKn4.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="https;//gibspons.dscvit.com"
        />
        <meta
          property="twitter:url"
          content="https://gibspons.dscvit.com"
        />
        <meta name="twitter:title" content="gibspons" />
        <meta
          name="twitter:description"
          content="Gibspons is a platform that helps you track sponsorships"
        />
        <meta
          name="twitter:image"
          content="https://imgur.com/ReuRKn4.png"
        />

        <title>gibspons</title>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${inter.className}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </MantineProvider>
      </body>
    </html>
  );
}
