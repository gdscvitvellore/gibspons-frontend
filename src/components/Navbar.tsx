"use client";

import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function Navbar() {
  return (
    <div className="fixed h-[64px] top-0 left-0 w-full bg-white text-xl text-black flex flex-row justify-between px-2 sm:px-8 align-middle items-center">
      <a className="h-[80%] w-auto flex flex-row" href="localhost:3000">
        <img src="/icon.svg" alt="logo" className="h-full w-auto " />
        <div className="flex flex-col justify-center items-start p-2 text-[#242424]">
          <h1 className="text-2xl font-bold  leading-[100%]">gibspons</h1>
          <p className="text-sm">by GDSC VIT.</p>
        </div>
      </a>
      <div className="flex flex-row justify-center items-center text-sm sm:text-xl">
        <Link
          href="https://dscvit.com"
          className="hover:bg-gray-200 rounded-full text-center p-2 w-[11rem] hidden md:block"
        >
          <p className="px-4">About GDSC</p>
        </Link>
        <Link href="/login">
          <p className="px-4 m-0 md:ml-4 py-2 md:w-[11rem] text-center text-white bg-[#242424] hover:bg-gray-600 rounded-full">
            Get Started
          </p>
        </Link>
      </div>
    </div>
  );
}
