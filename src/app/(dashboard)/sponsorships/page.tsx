"use client";
import { authStore } from "@/store/auth";
import { getSponsorsByOrg } from "@/utils/organisation";
import { Table, ScrollArea, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useLoadingStore } from "@/store/loading";
import { useLinkStore } from "@/store/crumbs";

interface RowData {
  id: number;
  name: string;
  added_by: string;
  status: string;
  event: string;
}

export default function Home() {
  const { accessToken, organisation } = authStore();
  const [sponsors, setSponsors] = useState<RowData[]>([]);
  const { startLoading, stopLoading } = useLoadingStore();
  const { setLink } = useLinkStore();

  useEffect(() => {
    setLink([{ href: "/sponsorships", title: "Sponsorships" }]);
    const fetchSponsors = async () => {
      startLoading();
      try {
        const data = await getSponsorsByOrg(accessToken, organisation);
        const rowData = data.map((sponsor) => {
          return {
            id: sponsor.id,
            name: sponsor.company_name,
            event: sponsor.event_name,
            added_by: sponsor.user_name,
            status: sponsor.status,
          };
        });
        setSponsors(rowData);
        stopLoading();
      } catch (error: any) {
        stopLoading();
        console.error(error);
      }
    };
    if (Number(organisation) !== 0) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = sponsors.map((row) => (
    <Table.Tr key={row.id} className=" border-b-2 border-black">
      <Table.Td>{row.name}</Table.Td>
      <Table.Td className="text-center">{row.event}</Table.Td>
      <Table.Td className="text-center">{row.added_by}</Table.Td>
      <Table.Td className="text-center">
        <span
          className={`
        ${row.status === "Accepted" ? "bg-[#E7F6EE] text-[#3AB876]" : ""}
        ${row.status === "Rejected" ? "bg-[#FEEDE9] text-[#F46E47]" : ""}
        ${row.status === "No Reply" ? "bg-[#FFF9E6] text-[#FFD12E]" : ""}
        ${row.status === "In Progress" ? "bg-[#D1C5FF] text-[#7F5DFF]" : ""}
        ${row.status === "Not Contacted" ? "bg-[#F6F6F6] text-[#414141]" : ""}
        p-2 px-4 rounded-full`}
        >
          {row.status}
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="h-full w-full absolute overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold">View Companies</h1>
      <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
        View, Update or Archive the Details of the Companies that have been
        recently contacted.
      </p>
      <Table.ScrollContainer type="native" minWidth={800} maw={"100%"}>
        <ScrollArea>
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
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={700}
            layout="fixed"
            borderColor="black"
            withRowBorders
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Company</Table.Th>
                <Table.Th className="text-center">Event</Table.Th>
                {/* <Table.Th className="text-center">Industry</Table.Th> */}
                <Table.Th className="text-center">Added By</Table.Th>
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
        </ScrollArea>
      </Table.ScrollContainer>
    </div>
  );
}
