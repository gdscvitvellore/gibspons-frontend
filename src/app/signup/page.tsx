"use client";
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "@/styles/auth.module.css";
import Image from "next/image";
import { handleRegister } from "@/utils/auth";
import { authStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthenticationImage() {
  // const { login } = authStore();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      loginPreference: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
      name: (value) =>
        value.length >= 3 ? null : "Name should be at least 3 characters",
    },
  });

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, name, username, loginPreference } = form.values;
    try {
      const res = await handleRegister(name, email, username, password);
      if (res.id) {
        // window.alert("Registered successfully");
        toast.success("User Registered successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      window.alert(error);
      console.log(error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <ToastContainer />
      <div className="hidden md:flex w-full h-full flex-row justify-center items-center">
        <Image src="/icon.svg" alt="Gibspons logo" width="60" height="60" />
        <div className="flex flex-col justify-center text-white text-left p-2">
          <h1 className="text-4xl font-bold leading-[100%]">gibspons</h1>
          <p className="text-md">sponsorships made easier</p>
        </div>
      </div>
      <Paper className={classes.form} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Create New Account
        </Title>
        <form
          className="max-w-[400px] self-center"
          onSubmit={(e) => register(e)}
        >
          <TextInput
            label="Name"
            placeholder="Rupaak"
            size="md"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Username"
            placeholder="Rupaak"
            size="md"
            required
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email address"
            placeholder="xyz@gmail.com"
            mt="lg"
            size="md"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your Password"
            mt="lg"
            size="md"
            required
            {...form.getInputProps("password")}
          />
          {/* <Checkbox
            id="loginPreference"
            label="Keep me logged in"
            mt="xl"
            size="md"
            {...form.getInputProps("loginPreference")}
          /> */}
          <p className="text-sm text-gray-500 mt-2">
            By continuing, you agree to our{" "}
            <Anchor<"a"> href="/terms" fw={700}>
              Terms of Service
            </Anchor>{" "}
            and{" "}
            <Anchor<"a"> href="/privacy" fw={700}>
              Privacy Policy
            </Anchor>
            .
          </p>
          <Button
            mt="xl"
            w="100%"
            size="md"
            ta="center"
            type="submit"
            className="bg-blue-500 hover:bg-blue-400"
          >
            Sign Up
          </Button>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor<"a">
            href="/login"
            fw={700}
            // onClick={(event) => event.preventDefault()}
          >
            Sign In
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
