"use client";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import classes from "@/styles/auth.module.css";
import Image from "next/image";
import { useForm, isEmail } from "@mantine/form";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/utils/auth";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import { getOrganisation } from "@/utils/organisation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { login } = authStore();
  const { updateOrganisation } = organisationStore();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      loginPreference: false,
    },

    validate: {
      email: isEmail("Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
    },
  });
  const router = useRouter();

  const onHandleLogin = async () => {
    const { email, password, loginPreference } = form.values;
    try {
      localStorage.clear();
      const res = await handleLogin(email.toLocaleLowerCase(), password);
      if (res?.access_token) {
        const {
          name,
          email,
          username,
          organisation,
          id,
          role,
          profile_pic,
          is_approved,
          access_token,
          refresh_token,
        } = res;
        const user = {
          name,
          email,
          loginPreference: loginPreference,
          id,
          username,
          organisation,
          profile_pic,
          role,
          is_approved,
          accessToken: access_token,
          refreshToken: refresh_token,
        };
        login(user);
        if (organisation && is_approved) {
          const org = await getOrganisation(access_token);
          updateOrganisation(org);
        }
        router.push("/team");
      } else {
        toast.error("Login Failed");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={classes.wrapper}>
      <ToastContainer />
      <div className="hidden md:flex w-full gap-4 h-full flex-row justify-center items-center">
        <Image src="/icon.svg" alt="Gibspons logo" width="100" height="100" />
        <div className="flex flex-col justify-center gap-2 text-white text-left p-2">
          <h1 className="text-5xl font-bold leading-[100%]">gibspons</h1>
          <p className=" text-xl">sponsorships made easier</p>
        </div>
      </div>
      <Paper className={classes.form} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={24}>
          Login
        </Title>
        <form
          className="w-full max-w-[400px] self-center"
          onSubmit={form.onSubmit(() => {
            onHandleLogin();
          })}
        >
          <TextInput
            label="Email address"
            placeholder="xyz@gmail.com"
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
            label="Keep me logged in"
            mt="xl"
            size="md"
            {...form.getInputProps("loginPreference")}
          /> */}
          <Button
            fullWidth
            mt="xl"
            className="bg-blue-500 hover:bg-blue-400"
            type="submit"
            size="md"
            w="100%"
          >
            Login
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="/signup"
            fw={700}
          >
            Register
          </Anchor>
        </Text>
        <Text ta="center" mt="md">
          <Anchor<"a"> href="/forgotPass" fw={500}>
            Forgot password?
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
