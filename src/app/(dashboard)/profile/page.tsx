/* eslint-disable @next/next/no-img-element */
"use client";

import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import { FaRegCopy, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Avatar, Modal, TextInput, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { updateUser, getUserData } from "@/utils/auth";
import { user } from "@/types/user";
import { useEffect, useState } from "react";
import { getSponsorsByUser } from "@/utils/organisation";
import { sponsorships } from "@/types/org";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export default function Profile() {
  const {
    name,
    email,
    username,
    profile_pic,
    accessToken,
    update,
    getUser,
    organisation,
  } = authStore();
  const [sponsors, setSponsors] = useState<sponsorships[]>([]);
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
    const respUser: user = await getUserData(accessToken);
    const User = getUser();
    update({
      ...User,
      profile_pic: respUser.profile_pic,
    });
  };

  useEffect(() => {
    if (accessToken === "" || organisation === null) {
      return;
    }
    async function fetchData() {
      try {
        const resp = await getSponsorsByUser(accessToken);
        resp.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setSponsors(resp);
      } catch (error: any) {
        toast.error(error.response.data);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex bg-white flex-col min-h-full min-w-[40rem] gap-8 p-4">
      <ToastContainer />
      <Modal
        classNames={{
          content: "border-2 border-blue-500 min-w-[40rem] min-h-[10rem]",
          root: "min-w-[50rem]",
          title: `font-bold ${outfit.className}`,
        }}
        opened={opened}
        centered
        size="auto"
        onClose={close}
        title="Edit Profile Picture"
        w={"100%"}
      >
        <form
          className="flex flex-col items-center justify-around h-[10rem] gap-4"
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
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-center my-4 font-bold">Sponsorships</h1>
        <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
          View, Update or Archive the Details of the Companies that have been
          recently contacted.
        </p>
      </div>
      <div className="flex flex-row w-full items-center justify-start gap-4">
        <div className="relative">
          <Avatar
            src={profile_pic}
            alt="profile pic"
            color="blue"
            className="rounded-full w-16 h-16 md:w-28 md:h-28 bg-cover bg-center"
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
      <div className="flex flex-col h-full md:flex-row gap-4 items-start justify-center">
        <div className="flex flex-col h-full gap-4 w-full">
          <div className="p-4 border-gray-300 border-2 rounded-md h-full max-w-[500px]n w-full flex flex-col">
            <p className="font-semibold">Name</p>
            <p>@{name}</p>
            <br />
            <p className="font-semibold">Username</p>
            <p>@{username}</p>
            <br />
            <p className="font-semibold">Email</p>
            <p>{email}</p>
          </div>
          <div
            className={`h-full p-4 w-full border-gray-300 border-2 rounded-md ${
              organisation === null ? "hidden" : ""
            } `}
          >
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
        <div
          className={`w-full flex h-full flex-col border-gray-300 border-2 rounded-md p-4 ${
            organisation === null ? "hidden" : ""
          }`}
        >
          <h1 className="font-bold h-full text-lg mb-2">
            Recently Contacted Sponsors
          </h1>
          {sponsors.slice(0, 10).map((sponsor, id) => (
            <div className="flex flex-row items-center gap-4" key={id}>
              <div className="grid grid-cols-3 w-full justify-between my-1">
                <h2 className="text-lg font-bold">{sponsor.company_name}</h2>
                <p className="text-sm text-center">{sponsor.updated_at}</p>
                <p className="text-sm text-right">{sponsor.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
