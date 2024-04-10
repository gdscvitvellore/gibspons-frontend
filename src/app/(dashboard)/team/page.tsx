"use client";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getEvents } from "@/utils/events";
import { IoMdAddCircleOutline } from "react-icons/io";

type Event = {
  id: number;
  name: string;
  date_of_event: string;
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
      className="flex flex-col p-4 bg-[#F4F4F4] w-full max-w-[30rem] h-full max-h-[12.75rem] shadow-md rounded-lg"
    >
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">{event.name}</h2>
        <h3 className="text-lg font-semibold">{event.date_of_event}</h3>
      </div>
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-lg">{event.expected_reg}</h3>
        <h3 className="text-lg">{event.description}</h3>
      </div>
      <div className="flex flex-row items-center gap-4">
        <h3 className="text-lg">{event.brochure}</h3>
        <h3 className="text-lg">{event.logo}</h3>
      </div>
    </a>
  );
};

export default function Home() {
  const { accessToken, role } = authStore();
  const [eventsData, setEventsData] = useState<Event[]>([
    {
      id: 1,
      name: "Event 1",
      date_of_event: "2022-12-12",
      expected_reg: 100,
      description: "Event 1 Description",
      brochure: "Brochure",
      logo: "Logo",
    },
    {
      id: 2,
      name: "Event 2",
      date_of_event: "2022-12-12",
      expected_reg: 100,
      description: "Event 2 Description",
      brochure: "Brochure",
      logo: "Logo",
    },
    {
      id: 3,
      name: "Event 3",
      date_of_event: "2022-12-12",
      expected_reg: 100,
      description: "Event 3 Description",
      brochure: "Brochure",
      logo: "Logo",
    },
  ]);
  const { org } = organisationStore();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(accessToken, org.id);
        setEventsData(data);
      } catch (error: any) {
        console.error(error);
      }
    };
    if (org.id !== 0) fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="h-full gap-8 flex flex-col items-center p-4">
        <div className="flex flex-row w-full items-center gap-4 h-full max-h-[11rem] justify-between">
          <div className="flex w-full max-w-[35rem] flex-col">
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
          <div className="bg-[#4D4D4D] p-4 font-bold text-white text-3xl rounded-md shadow-md w-full max-w-[30rem] h-full max-h-[11rem]">
            Overview
          </div>
        </div>
        <div
          className={`w-full flex flex-row items-center justify-start ${
            role === "owner" || role === "admin" ? "" : "hidden"
          } `}
        >
          <button className="flex bg-white flex-row sticky bottom-0 items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4 z-10">
            <IoMdAddCircleOutline className="text-2xl font-bold" /> Create New
            Event
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full pt-4">
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
