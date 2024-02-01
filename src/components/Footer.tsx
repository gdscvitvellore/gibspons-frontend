'use client'
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full min-h-[40vh] bg-[#5379F6]">
      <div className="flex flex-col justify-center items-end">
        <div className="min-h-[30vh] w-full flex flex-col p-8 justify-between items-center md:flex-row">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center ">
              <Image
                src="/icon.svg"
                className="h-[5rem] w-auto m-auto"
                alt="logo"
                width={50}
                height={50}
              />
              <div className="flex flex-col justify-center max-h-[5rem] items-center p-2">
                <h1 className="text-[2rem] text-black font-bold">gibspons</h1>
                <p className="text-[1rem] text-black">
                  sponsorships made easier
                </p>
              </div>
            </div>
            <h1 className="text-[1.125rem] mt-4 text-white font-semibold">
              Lorem ipsum dolor sit amet <br /> consectetur
            </h1>
          </div>
          <div className="flex flex-row m-auto w-[85vw] h-full justify-between content-between items-center md:max-w-[40vw] lg:m-0 lg:w-[30vw]">
            <div className="flex flex-col m-4 h-full justify-center self-start gap-2 text-white text-[1rem] text-left">
              <h1 className="text-[1.5rem] text-black mb-2">About</h1>
              <Link href="#features" className=" hover:scale-[110%]">
                Features
              </Link>
              <Link href="#tryNow" className=" hover:scale-[110%]">
                Try Now
              </Link>
              <Link href="#contact" className=" hover:scale-[110%]">
                Contact
              </Link>
            </div>
            <div className="flex flex-col m-4 h-full justify-center self-start gap-2 text-white text-[1rem] text-left">
              <h1 className="text-[1.5rem] text-black mb-2">Community</h1>
              <Link href="#Tutorials" className=" hover:scale-[110%]">
                Tutorials
              </Link>
              <Link href="#Blog" className=" hover:scale-[110%]">
                Blog
              </Link>
            </div>
            <div className="flex flex-col m-4 h-full justify-center self-start gap-2 text-white text-[1rem] text-left">
              <h1 className="text-[1.5rem] text-black mb-2">Socials</h1>
              <Link
                href="https://facebook.com/gdscvitvellore"
                className=" hover:scale-[110%]"
              >
                Facebook
              </Link>
              <Link
                href="https://instagram.com/gdscvitvellore"
                className=" hover:scale-[110%]"
              >
                Instagram
              </Link>
              <Link
                href="https://twitter.com/gdscvit"
                className=" hover:scale-[110%]"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[10vh] w-full bg-[#F8F8F8] flex flex-row justify-center items-center">
          <div className="flex flex-col m-4 w-auto justify-center items-center">
            <h1 className="text-[1.5rem] text-clip text-[#070707] font-[600] md:text-[2rem]">
              Made with &#10084;&#65039; by GDSC VIT.
            </h1>
            <p className="text-[0.75rem] pb-2 text-[#555] md:text-[1rem]">
              2023 &#169; All Rights Reserved, Google Developer Student Clubs
              VIT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
