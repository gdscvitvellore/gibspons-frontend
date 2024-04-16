/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import { FaRegCopy } from "react-icons/fa";
import { toast, ToastContainer, ToastItem } from "react-toastify";
import { Avatar, Modal, TextInput, Button } from "@mantine/core";
import { FaEdit } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { updateUser, getUserData } from "@/utils/auth";
import { user } from "@/types/user";

export default function Profile() {
  const { name, email, profile_pic, accessToken, update, getUser } = authStore();
  const sponsors: any = [];
  const { org } = organisationStore();
  const [opened, { open, close }] = useDisclosure(false);

  const formContent = useForm({
    initialValues: {
      profilePic: "",
    },
    validate: {
      profilePic: (value) => (value.length > 0 ? null : "Enter an URL"),
    },
  });

  const refreshData = async () => {
    //todo: put logic here once backend is updated
    const respUser: user = await getUserData(accessToken);
    const User = getUser();
    update({
      ...User,
      profile_pic: respUser.profile_pic,
    });
  };

  return (
    <div className="flex bg-white flex-col h-full gap-8 p-4">
      <ToastContainer />
      <Modal
        classNames={{ content: "border-2 border-red-500", root: "" }}
        opened={opened}
        centered
        size="auto"
        onClose={close}
        title="Edit Profil Picture"
        w={"100%"}
      >
        <form
        className="flex flex-col gap-4"
          onSubmit={formContent.onSubmit(() => {
            const body = {
              profile_pic: formContent.values.profilePic,
            };
            updateUser({ accessToken: accessToken, body: body });
            refreshData();
            close();
          })}
        >
          <TextInput
            label="Profile Pic"
            placeholder=""
            size="md"
            w={"100%"}
            classNames={{ input: "w-full" }}
            {...formContent.getInputProps("profilePic")}
          />
          <Button
            className="bg-blue-500 w-full self-center hover:bg-blue-400"
            type="submit"
            size="md"
            w="100%"
          >
            Update
          </Button>
        </form>
      </Modal>
      <h1 className="text-2xl font-bold w-full text-center">Your Profile</h1>
      <div className="flex flex-row w-full items-center justify-start gap-4">
        <div className="relative">
          <Avatar
            src={profile_pic}
            alt="profile pic"
            color="blue"
            className="rounded-full w-28 h-28 bg-cover bg-center"
          />
          <div className="absolute rounded-full w-28 h-28 inset-0 flex items-center bg-slate-500 justify-center opacity-0 hover:opacity-50 transition-opacity duration-300">
            <button onClick={open} className="bg-gray-200 p-2 rounded-full">
              <FaEdit />
            </button>
          </div>
        </div>{" "}
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm">{email}</p>
        </div>
      </div>
      <div className="flex flex-col h-full md:flex-row gap-4 items-center justify-center">
        <div className="flex flex-col h-full gap-4 w-full">
          <div className="border p-4 border-black rounded-md w-full flex flex-col">
            <p className="font-semibold">Username</p>
            <p>@{name}</p>
            <br />
            <p className="font-semibold">Email</p>
            <p>{email}</p>
          </div>
          <div className="h-fit  p-4 w-full border border-black rounded-md ">
            <h1 className="text-lg font-bold">Team Information</h1>
            <div className="flex flex-row gap-4">
              <p className="font-semibold">Organisation:</p>
              <p>{org.name}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-semibold">Invite Code:</p>
              <p>{org.invite_code}</p>
              <FaRegCopy
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(org.invite_code);
                  toast.success("Copied Invite code to clipboard");
                }}
              />
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-semibold">Location:</p>
              <p>{org.location}</p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="font-semibold">Industry:</p>
              <p>{org.industry}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex h-full flex-col border border-black rounded-md p-4">
          <h1 className="font-bold h-full text-lg">
            Recently Contacted Sponsors
          </h1>
          {sponsors.length === 0 ? (
            <p>No sponsors contacted yet</p>
          ) : (
            Object.keys(sponsors).map((sponsor, id) => (
              <div className="flex flex-row items-center gap-4" key={id}>
                <Image
                  height={50}
                  width={50}
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
                  alt="Profile Picture"
                  className="rounded-full w-14 h-14"
                />
                <div>
                  <h2 className="text-lg font-bold">{sponsor}</h2>
                  <p className="text-sm">{sponsors[sponsor]}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
