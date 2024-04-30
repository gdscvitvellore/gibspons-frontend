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
import LoadingScreen from "@/components/loadingScreen";

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
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <LoadingScreen />
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
