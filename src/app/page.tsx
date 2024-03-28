/* eslint-disable @next/next/no-img-element */
'use client'
import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import styles from "../styles/index.module.css";
import Footer from "../components/Footer";
import { authStore } from "@/store/auth";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { initializeFromLocalStorage } = authStore();

  useEffect(() => {
    initializeFromLocalStorage()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className="w-full h-full bg-[#F8F8F8]">
      <Navbar />
      <div
        id="home"
        className="h-[100vh] bg-[#191919] p-4 w-full flex flex-row justify-center items-center"
      >
        <div className="md:max-w-[30vw]">
          <h1 className="text-[6rem] break-words font-bold text-white md:max-w-[30vw] leading-[110%]">
            draft <br /> <span className="text-[#5379F6]">mails</span> in a
            blink
          </h1>
          <p className="mt-4 text-[1.75rem] text-white">
            introducing gibspons, draft mails, track sponsorships, and manage
            negotiations, all in one place!
          </p>
          <div className="mt-8">
            <button className="px-8 py-2 text-[#070707] text-[1.3rem] bg-[#5379F6] rounded-full mr-4 hover:scale-110">
              Get Started
            </button>
          </div>
        </div>
        <div className="w-auto h-auto hidden md:block">
          <Image
            src="/heroImage.svg"
            alt="hero"
            className=""
            width={500}
            height={500}
          />
        </div>
      </div>
      <div
        className={`w-full h-[60vh] flex flex-col md:gap-40 justify-center items-center ${styles.stat} md:flex-row`}
      >
        <div className="flex flex-col justify-center items-center h-[80%] w-auto md:max-w-[30vw]">
          <h1 className=" text-[#343434] text-[2.2rem] break-words ">
            Need some 💸? That&apos;s where we come in! 🤑
          </h1>
          <div className="flex flex-row justify-around gap-4 items-center">
            <div>
              <p className="text-[2rem] text-[#5379F6] font-semibold md:text-[4rem]">
                1,200+
              </p>
              <p className="text-[1rem] text-[#222] text-left">
                Email Generated So Far!
              </p>
            </div>
            <div>
              <p className="text-[2rem] md:text-[4rem] text-[#5379F6] font-semibold ">
                92%
              </p>
              <p className="text-[1rem] text-[#222] text-left">
                Response Rate!
              </p>
            </div>
          </div>
        </div>
        <div className="min-h-[20vh] max-h-[50vh] md:max-w-[30vw] overflow-clip">
          <img
            src="https://source.unsplash.com/random"
            alt="random"
            className="md:w-full rounded-xl object-cover"
          />
        </div>
      </div>
      <div className="w-full h-[70vh] bg-[#F8F8F8]">
        <h1 className="self-center py-16 m-auto break-words w-full p-4 md:max-w-[40vw] text-center text-[2.2rem] text-black ">
          Here&apos;s what <span className="text-[#5379F6]">people</span> are
          saying! &#128173;
        </h1>
      </div>
      <Footer />
    </div>
  );
}
