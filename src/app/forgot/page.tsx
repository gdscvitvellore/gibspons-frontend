"use client";
import { Paper, TextInput, Button, Title } from "@mantine/core";
import classes from "@/styles/auth.module.css";
import Image from "next/image";
import { useForm, isEmail } from "@mantine/form";
import { useRouter } from "next/navigation";
import { handleForgetPass } from "@/utils/auth";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: isEmail("Invalid email"),
    },
  });
  const router = useRouter();

  const onHandleForgetPass = async () => {
    const { email } = form.values;
    try {
      await handleForgetPass(email);
      toast.success("Password reset link sent to your email");
      router.push("/login");
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
      <Paper className={classes.form} p={30}>
        <Title order={1} className={classes.title} ta="center" mt="md" mb={50}>
          Reset Password
        </Title>
        <form
          className="w-full max-w-[400px] self-center"
          onSubmit={form.onSubmit(() => {
            onHandleForgetPass();
          })}
        >
          <TextInput
            label="Email address"
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
    </div>
  );
}
