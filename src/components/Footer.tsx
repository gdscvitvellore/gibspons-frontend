"use client";

export default function Footer() {
  return (
    <div className="w-full bg-[#5379F6]">
      <div className="flex flex-col justify-center items-end">
        <div className="min-h-[4rem] w-full bg-[#F8F8F8] flex flex-row justify-center items-center">
          <div className="flex flex-col p-[5px] w-auto justify-center items-center">
            <h1 className="text-[1.25rem] text-clip text-[#070707] font-[600]">
              Made with &#10084;&#65039; by GDSC VIT.
            </h1>
            <p className="text-[0.75rem] pb-2 text-center text-[#555] md:text-[1rem]">
              2024 &#169; All Rights Reserved, Google Developer Student Clubs
              VIT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
