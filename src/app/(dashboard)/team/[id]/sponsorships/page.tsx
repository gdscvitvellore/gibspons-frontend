"use client";
import { authStore } from "@/store/auth";
import { sponsByOrg } from "@/types/org";
import { fetchAllSponsors } from "@/utils/organisation";

import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
} from "@mantine/core";
import classes from "@/styles/TableSort.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { link } from "fs";
import { organisationStore } from "@/store/organisation";

interface RowData {
  id: number;
  name: string;
  industry: string;
  status: string;
  event: number;
}

export default function Home() {
  const { accessToken, organisation } = authStore();
  const { org } = organisationStore();
  const [sponsors, setSponsors] = useState<RowData[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await fetchAllSponsors(accessToken, org.id);
        const rowData = data.map((sponsor) => {
          return {
            id: sponsor.id,
            name: sponsor.name,
            event: sponsor.event,
            industry: sponsor.industry,
            status: sponsor.status,
          };
        });
        setSponsors(rowData);
      } catch (error: any) {
        console.error(error);
      }
    };
    if (org.id !== 0) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = sponsors.map((row) => (
    <Table.Tr key={row.id} className=" border-b-2 border-black">
      <Table.Td>{row.name}</Table.Td>
      <Table.Td className="text-center">{row.event}</Table.Td>
      <Table.Td className="text-center">{row.industry}</Table.Td>
      <Table.Td className="text-center">
        <span className="bg-[#F6F6F6] p-2 px-4 rounded-full">{row.status}</span>
      </Table.Td>
      <Table.Td className="text-center">
        <span
          className={`
        ${row.status === "Accepted" ? "bg-[#D1FAE5] text-[#10B981]" : ""}
        ${row.status === "Rejected" ? "bg-[#FEE2E2] text-[#EF4444]" : ""}
        ${row.status === "No Reply" ? "bg-[#FEF3C7] text-[#F59E0B]" : ""}
        ${row.status === "In Progress" ? "bg-[#FCE7F3] text-[#EC4899]" : ""}
        ${row.status === "None" ? "bg-[#F9FAFB] text-[#6B7280]" : ""}
        p-2 px-4 rounded-full`}
        >
          {row.status}
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="h-full absolute max-w-full overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold">View Companies</h1>
      <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
        View, Update or Archive the Details of the Companies that have been
        recently contacted.
      </p>

      {/* <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      /> */}
      <Table.ScrollContainer
        // className=" inline overflow-x-hidden"
        type="native"
        minWidth={800}
        maw={"100%"}
      >
        <ScrollArea>
          {/* <div
        className="min-w-700 overflow-scroll max-w-full"  
      > */}
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={800}
            layout="fixed"
            borderColor="black"
            withRowBorders
            striped
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Company</Table.Th>
                <Table.Th className="text-center">Event</Table.Th>
                <Table.Th className="text-center">Industry</Table.Th>
                <Table.Th className="text-center">Status</Table.Th>
                <Table.Th className="text-center">Status</Table.Th>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text fw={500} ta="center">
                      Nothing found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
          {/* </div> */}
        </ScrollArea>
      </Table.ScrollContainer>
    </div>
  );
}
