"use client";

import Image from "next/image";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";

export default function profile() {
  const { name, email } = authStore();
  const sponsors: any = [];
  const { org } = organisationStore();

  return (
    <div className="flex bg-white flex-col h-full gap-8">
      <h1 className="text-2xl font-bold w-full text-center">Your Profile</h1>
      <div className="flex flex-row w-full items-center justify-start gap-4">
        <Image
          height={100}
          width={100}
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
            <p>Username</p>
            <p>@{name}</p>
            <br />
            <p>Email</p>
            <p>{email}</p>
          </div>
          <div className="h-full p-4 w-full border border-black rounded-md ">
            <h1 className="text-lg font-bold">Team Information</h1>
            <p>{org.name}</p>
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
