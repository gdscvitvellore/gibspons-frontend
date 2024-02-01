'use client'

import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function Navbar() {
  return (
    <div className="fixed h-[64px] top-0 left-0 w-full bg-white text-xl text-black flex flex-row justify-between px-8 align-middle items-center">
      <a className="h-[80%] w-auto flex flex-row" href="localhost:3000">
        <img src="/icon.svg" alt="logo" className="h-full w-auto" />
        <div className="flex flex-col justify-center items-center p-2">
          <h1 className="text-2xl font-bold leading-[100%]">gibspons</h1>
          <p className="text-sm">by GDSC VIT.</p>
        </div>
      </a>
      <div className="flex flex-row justify-center items-center text-xl">
        <Link
          href="#home"
          className="hover:bg-gray-200 rounded-full p-2 hidden md:block"
        >
          <p className="px-4">Home</p>
        </Link>
        <Link
          href="https://dscvit.com"
          className="hover:bg-gray-200 rounded-full p-2 hidden md:block"
        >
          <p className="px-4">About GDSC</p>
        </Link>
        <Link
          href="/product"
          className="hover:bg-gray-200 rounded-full p-2 hidden md:block"
        >
          <p className="px-4">Product</p>
        </Link>
        <Link
          href="/blogs"
          className="hover:bg-gray-200 rounded-full p-2 hidden md:block"
        >
          <p className="px-4">Blogs</p>
        </Link>
        <Link href="/login" className="hover:scale-110">
          <p className="px-4 m-0 md:ml-4 py-2 text-white bg-black rounded-full">
            Get Started
          </p>
        </Link>
      </div>
    </div>
  );
}
