"use client";

import { authStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { sponsByEvent } from "@/types/org";
import { getSponsorsByEvent } from "@/utils/organisation";
import { useLoadingStore } from "@/store/loading";
import { Table, ScrollArea, Text } from "@mantine/core";
import PieChart from "@/components/pieChart";
import { useLinkStore } from "@/store/crumbs";
import { organisationStore } from "@/store/organisation";

export default function Home({ params }: Readonly<{ params: { id: number } }>) {
  const { organisation, accessToken } = authStore();
  const [data, setData] = useState<sponsByEvent>();
  const { startLoading, stopLoading } = useLoadingStore();
  const { setLink } = useLinkStore();
  const { getOrganisation } = organisationStore();

  useEffect(() => {
    const fetchSponsors = async () => {
      startLoading();
      try {
        const data = await getSponsorsByEvent(accessToken, String(params.id));
        setData(data);
        setLink([
          { href: `/team`, title: `${getOrganisation().name}` },
          { href: `/team/${params.id}/dashboard`, title: `${data.event.name}` },
        ]);
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
    <Table.Tr key={row.id} className=" border-b-2">
      <Table.Td>{row.company_name}</Table.Td>
      <Table.Td className="text-center">{row.user_name}</Table.Td>
      <Table.Td className="text-center">
        <p
          className={`${row.status} py-2 rounded-full w-[10rem] m-auto`}
        >
          {row.status}
        </p>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex flex-row h-full overflow-x-auto absolute gap-4 w-full rounded-md">
      <div className="flex w-full h-full flex-col gap-4">
        <div className="bg-gradient-to-r from-[#4d4d4d] to-[#3e3e3e] h-full max-h-[10rem]  w-full justify-between flex rounded-md flex-col gap-4 md:flex-row p-4 text-white">
          <div className="flex flex-col">
            <p className="text-xs font-[500]">Overview</p>
            <p className="text-4xl font-[700]">{data?.event?.name}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-[500] w-full text-right">
              Total Amount Raised
            </p>
            <p className="text-4xl font-bold md:text-right">
              &#8377;{data?.event?.money_raised}
            </p>
          </div>
        </div>
        <div className="bg-white relative h-full min-h-fit p-4 rounded-md">
          <h1 className="font-bold mb-8">Companies & Sponsors</h1>
          <Table.ScrollContainer
            type="native"
            mah={"80%"}
            minWidth={500}
            maw={"100%"}
          >
            <ScrollArea>
              <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                miw={500}
                layout="fixed"
                striped
              >
                <Table.Tbody>
                  <Table.Tr bg="white">
                    <Table.Th>Company</Table.Th>
                    <Table.Th className="text-center">Added By</Table.Th>
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
        </div>
        <div className="h-[80%] bg-white rounded-md p-2 w-full">
          {organisation && (
            <PieChart accessToken={accessToken} event_id={params.id} />
          )}
        </div>
      </div>
    </div>
  );
}
