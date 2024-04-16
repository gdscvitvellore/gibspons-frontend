/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import { FaRegCopy } from "react-icons/fa";
import { toast, ToastContainer, ToastItem } from "react-toastify";

export default function profile() {
  const { name, email } = authStore();
  const sponsors: any = [];
  const { org } = organisationStore();

  return (
    <div className="flex bg-white flex-col h-full gap-8 p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold w-full text-center">Your Profile</h1>
      <div className="flex flex-row w-full items-center justify-start gap-4">
        <img
          // height={100}
          // width={100}
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
          alt="Profile Picture"
          className="rounded-full w-28 h-28"
        />
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
