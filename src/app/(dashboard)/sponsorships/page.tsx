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
    <Table.Tr key={row.id} className="p-2">
      <Table.Td>{row.name}</Table.Td>
      <Table.Td className="text-center">{row.event}</Table.Td>
      <Table.Td className="text-center">{row.added_by}</Table.Td>
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
    <div className="h-full w-full absolute overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
      <div>
        <h1 className="text-3xl text-center my-4 font-bold">Sponsorships</h1>
        <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
          View the Details of the Companies that have been
          recently contacted.
        </p>
      </div>
      <Table.ScrollContainer type="native" minWidth={800} maw={"100%"}>
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={700}
            striped
            layout="fixed"
          >
            <Table.Tbody>
              <Table.Tr bg={"white"}>
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
