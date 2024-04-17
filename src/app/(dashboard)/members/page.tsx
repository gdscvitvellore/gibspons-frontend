"use client";
import { authStore } from "@/store/auth";
import { organisationStore } from "@/store/organisation";
import Image from "next/image";
import { IoLocationSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getMembersByOrg } from "@/utils/organisation";
import MembersTable from "@/components/MembersTable";

interface RowData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
  username: string;
}

export default function Home() {
  const { accessToken } = authStore();
  const { org } = organisationStore();
  const [membersApproved, setMembersApproved] = useState<RowData[] | null>();
  const [membersNotApproved, setMembersNotApproved] = useState<
    RowData[] | null
  >();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembersByOrg(accessToken, org.id);
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
    if (org.id !== 0) fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full absolute w-full overflow-x-auto bg-white rounded-md md:gap-4 flex flex-col items-center p-4">
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
      {membersNotApproved && <MembersTable data={membersNotApproved} approved={false} />}
      <br />
      {membersApproved && <MembersTable data={membersApproved} approved={true}/>}
    </div>
  );
}
