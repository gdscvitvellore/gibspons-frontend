"use client";

import { authStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { sponsByEvent } from "@/types/org";
import { getSponsorsByEvent } from "@/utils/organisation";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/store/loading";
import { Table, ScrollArea, Text } from "@mantine/core";
import PieChart from "@/components/pieChart";

interface RowData {
  id: number;
  name: string;
  added_by: string;
  status: string;
  event: string;
}

export default function Home({ params }: { params: { id: number } }) {
  const { organisation, accessToken } = authStore();
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<sponsByEvent>();
  const { startLoading, stopLoading } = useLoadingStore();

  useEffect(() => {
    const fetchSponsors = async () => {
      startLoading();
      try {
        const data = await getSponsorsByEvent(accessToken, event_id);
        setData(data);
        stopLoading();
      } catch (e) {
        stopLoading();
        console.log(e);
      }
    };
    if (Number(organisation) === 0) return;
    fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = data?.sponsorships?.map((row) => (
    <Table.Tr key={row.id} className=" border-b-2 border-black">
      <Table.Td>{row.company_name}</Table.Td>
      <Table.Td className="text-center">{row.user_name}</Table.Td>
      {/* <Table.Td className="text-center">{row.status}</Table.Td> */}
      <Table.Td className="text-center">
        <span
          className={`
        ${row.status === "Accepted" ? "bg-[#E7F6EE] text-[#3AB876]" : ""}
        ${row.status === "Rejected" ? "bg-[#FEEDE9] text-[#F46E47]" : ""}
        ${row.status === "No Reply" ? "bg-[#FFF9E6] text-[#FFD12E]" : ""}
        ${row.status === "In Progress" ? "bg-[#D1C5FF] text-[#7F5DFF]" : ""}
        ${row.status === "None" ? "bg-[#F6F6F6] text-[#414141]" : ""}
        p-2 px-4 rounded-full`}
        >
          {row.status}
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-row h-full overflow-x-auto absolute gap-4 w-full rounded-md">
      <div className="flex w-full h-full flex-col gap-4">
        <div className="bg-gradient-to-r from-[#4d4d4d] to-[#3e3e3e]  w-full justify-between flex rounded-md flex-col gap-4 md:flex-row p-4 text-white">
          <div className="flex flex-col">
            <p className="text-xs">Overview</p>
            <p className="text-4xl">{data?.event?.name}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs">Total Amount Raised</p>
            <p className="text-4xl md:text-right">
              &#8377;{data?.event?.money_raised}
            </p>
          </div>
        </div>
        <div className="bg-white h-full min-h-fit p-4 rounded-md">
          <h1 className="font-bold mb-8">Companies & Sponsors</h1>
          <Table.ScrollContainer type="native" minWidth={500} maw={"100%"}>
            <ScrollArea>
              <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                miw={500}
                layout="fixed"
                borderColor="black"
                withRowBorders
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Company</Table.Th>
                    <Table.Th className="text-center">Added By</Table.Th>
                    {/* <Table.Th className="text-center">Industry</Table.Th> */}
                    {/* <Table.Th className="text-center">Added By</Table.Th> */}
                    <Table.Th className="text-center">Status</Table.Th>
                  </Table.Tr>
                </Table.Tbody>
                <Table.Tbody>
                  {rows && rows?.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={3}>
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
      </div>
      <div className="w-[50%] max-h-full min-w-[400px] gap-4 flex flex-col">
        <div className="h-full w-full rounded-md p-2 bg-white">
          LeaderBoard Position
          {/* {organisation && <PieChart accessToken={accessToken} event_id={event_id} />} */}
        </div>
        <div className="h-[80%] bg-white rounded-md p-2 w-full">
          {/* <p className="w-full h-fit text-center">Response Statistics</p> */}
          {organisation && <PieChart accessToken={accessToken} event_id={event_id} />}
        </div>
      </div>
    </div>
  );
}
