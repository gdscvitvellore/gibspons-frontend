"use client";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getEvents } from "@/utils/events";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loading";
import { useLinkStore } from "@/store/crumbs";

type Event = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  expected_reg: number;
  description: string;
  brochure: string | null;
  logo: string | null;
};

const eventCard = (event: Event) => {
  return (
    <a
      key={event.id}
      href={`/team/${event.id}/dashboard`}
      className="flex relative flex-col p-4 bg-[#F4F4F4] hover:bg-[#dee5ee] transition-colors duration-200 max-w-[30rem] w-full h-[12.75rem] max-h-full shadow-md rounded-lg"
    >
      <div className="flex h-full w-wull text-[2rem] text-[#6D6D6D] flex-row items-center justify-center">
        {event.logo ? (
          <Image src={event.logo} alt="Event Logo" width={200} height={200} />
        ) : (
          <h1>{event.name}</h1>
        )}
      </div>
    </a>
  );
};

export default function Home() {
  const { accessToken, role } = authStore();
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingStore();
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const { org } = organisationStore();
  const { setLink } = useLinkStore();

  useEffect(() => {
    setLink([
      { href: "/team", title: "My Team" },
    ]);
    const fetchEvents = async () => {
      startLoading();
      try {
        const data = await getEvents(accessToken, org.id, null);
        setEventsData(data);
        stopLoading();
      } catch (error: any) {
        stopLoading();
        console.error(error);
      }
    };
    if (org.id !== 0) fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative h-fit min-h-full bg-white gap-8 flex flex-col items-center p-4">
        <div className="flex flex-col md:flex-row w-full items-center gap-4 h-full justify-center">
          <div className="flex flex-col items-center md:items-start w-full max-w-[30rem]">
            {org.logo && (
              <Image
                src={org.logo}
                alt="Organisation Logo"
                width={100}
                height={100}
              />
            )}
            <h1 className=" font-semibold text-2xl">{org.name}</h1>
            {org.location && (
              <div className="flex flex-row gap-4 items-center">
                <IoLocationSharp />
                <h2 className="text-lg ">{org.location}</h2>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-r from-[#4d4d4d] to-[#3e3e3e] p-4 py-8 flex flex-col sm:flex-row justify-between text-white rounded-md shadow-md w-full max-w-[30rem]">
            <div className="flex flex-col w-full justify-center">
              <p>
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-xl md:text-3xl font-bold">OVERVIEW</p>
            </div>
            <div className="flex flex-col text-right w-full justify-center">
              <p>Amount Raised</p>
              <p className="text-xl md:text-3xl font-bold">
                &#8377;{org.total_money_raised}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`w-full flex flex-row items-center justify-center  ${
            role === "owner" || role === "admin" ? "" : "hidden"
          } `}
        >
          <button
            onClick={() => {
              router.push("/team/createNewEvent");
            }}
            className="flex bg-white hover:bg-[#dee5ee] flex-row sticky bottom-0 items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4 z-10"
          >
            <IoMdAddCircleOutline className="text-2xl font-bold" /> Create New
            Event
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full">
          {eventsData.length !== 0 ? (
            eventsData.map((event) => eventCard(event))
          ) : (
            <h1>No Events</h1>
          )}
        </div>
      </div>
    </>
  );
}
