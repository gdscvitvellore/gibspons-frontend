"use client";

import { useState } from "react";
import { Paper, TextInput, Button, Title, PinInput } from "@mantine/core";
import classes from "@/styles/auth.module.css";
import Image from "next/image";
import { useForm, isEmail } from "@mantine/form";
import { useRouter } from "next/navigation";
import { handleForgetPass, handleVerifyOTP } from "@/utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email"),
    },
  });
  const formVerify = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
      code: 0,
    },
    validateInputOnChange: ["confirmPassword", "password"],
    validate: {
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      code: (value) => (String(value).length === 6 ? null : "Invalid code"),
    },
  });

  const [isVerify, setIsVerify] = useState(false);
  const onHandleForgetPass = async () => {
    const { email } = form.values;
    try {
      await handleForgetPass(email);
      toast.success("OTP sent to your email");
      setIsVerify(true);
    } catch (error: any) {
      console.error(error);
    }
  };

  const onHandleSetNewPass = async () => {
    const { code, password } = formVerify.values;
    const { email } = form.values;
    try {
      const resp = await handleVerifyOTP(code, password, email);
      if (resp.msg) {
        toast.success(resp.msg);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      if (resp.error) {
        toast.error(resp.error);
      }
      console.log(resp);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <ToastContainer />
      <div className="hidden md:flex w-full h-full flex-row justify-center items-center">
        <Image src="/icon.svg" alt="Gibspons logo" width="60" height="60" />
        <div className="flex flex-col justify-center text-white text-left p-2">
          <h1 className="text-3xl font-bold leading-[100%]">gibspons</h1>
          <p className="text-sm">sponsorships made easier</p>
        </div>
      </div>
      {isVerify === false ? (
        <Paper className={classes.form} p={30}>
          <Title
            order={1}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Reset Password
          </Title>
          <form
            className="w-full max-w-[400px] self-center"
            onSubmit={form.onSubmit(() => {
              onHandleForgetPass();
            })}
          >
            <TextInput
              label="Email ID"
              placeholder="xyz@gmail.com"
              size="md"
              required
              {...form.getInputProps("email")}
            />
            <Button
              fullWidth
              mt="xl"
              className="bg-blue-500 hover:bg-blue-400"
              type="submit"
              size="md"
              w="100%"
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      ) : (
        <Paper className={classes.form} p={30}>
          <Title
            order={1}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Set New Password
          </Title>
          <form
            className="w-full max-w-[400px] self-center"
            onSubmit={formVerify.onSubmit(() => {
              onHandleSetNewPass();
            })}
          >
            <label className="text-md font-[500]">OTP</label>
            <PinInput
              length={6}
              type="number"
              {...formVerify.getInputProps("code")}
            />
            <TextInput
              label="New Password"
              placeholder="Your Password"
              mt="lg"
              size="md"
              required
              {...formVerify.getInputProps("password")}
            />
            <TextInput
              label="Confirm New Password"
              placeholder="Your Password"
              mt="lg"
              size="md"
              required
              {...formVerify.getInputProps("confirmPassword")}
            />
            <Button
              fullWidth
              mt="xl"
              className="bg-blue-500 hover:bg-blue-400"
              type="submit"
              size="md"
              w="100%"
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      )}
    </div>
  );
}
