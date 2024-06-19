"use client";

import { organisationStore } from "@/store/organisation";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getMembersByOrg } from "@/utils/organisation";
import MembersTable from "@/components/MembersTable";
import { useLinkStore } from "@/store/crumbs";

interface RowData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
  username: string;
}

export default function Home() {
  const { org } = organisationStore();
  const [membersApproved, setMembersApproved] = useState<RowData[] | null>();
  const [membersNotApproved, setMembersNotApproved] = useState<
    RowData[] | null
  >();
  const { setLink } = useLinkStore();

  const fetchMembers = async () => {
    try {
      const data = await getMembersByOrg(org.id);
      const rowDataApproved = data
        .filter((member) => member.is_approved === true)
        .map((member) => {
          return {
            id: String(member.id),
            name: member.name,
            email: member.email,
            created_at: new Date(member.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            role: member.role,
            username: member.username,
          };
        });
      const rowDataNotApproved = data
        .filter((member) => member.is_approved === false)
        .map((member) => {
          return {
            id: String(member.id),
            name: member.name,
            email: member.email,
            created_at: new Date(member.created_at).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            ),
            role: member.role,
            username: member.username,
          };
        });
      setMembersApproved(rowDataApproved);
      setMembersNotApproved(
        rowDataNotApproved.length === 0 ? null : rowDataNotApproved
      );
    } catch (error: any) {
      console.error(error);
    }
  };

  const refreshData = async () => {
    fetchMembers();
  };

  useEffect(() => {
    setLink([{ href: "/members", title: "Members" }]);
    if (org.id !== 0) fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-full absolute w-full bg-white rounded-md lg:gap-4 flex flex-col items-center p-4">
      <div className="flex flex-col md:flex-row w-full items-center gap-4 justify-center">
        <div className="flex flex-col items-center md:items-start w-full max-w-[35rem]">
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
      {membersNotApproved && (
        <MembersTable
          data={membersNotApproved}
          approved={false}
          refresh={refreshData}
        />
      )}
      <br />
      {membersApproved && (
        <MembersTable
          data={membersApproved}
          approved={true}
          refresh={refreshData}
        />
      )}
    </div>
  );
}
