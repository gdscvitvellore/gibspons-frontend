"use client";
import { authStore } from "@/store/auth";
import { getSponsorsByEvent } from "@/utils/organisation";

import { Table, ScrollArea, Text, Modal } from "@mantine/core";
import { useState, useEffect } from "react";
import { organisationStore } from "@/store/organisation";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import ModifyCompany from "@/components/companyForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLinkStore } from "@/store/crumbs";

interface RowData {
  id: number;
  name: string;
  company_name: string;
  added_by: string;
  status: string;
}

export default function Home({ params }: { params: { id: number } }) {
  const { accessToken } = authStore();
  const { org } = organisationStore();
  const [sponsors, setSponsors] = useState<RowData[]>([]);
  const [companyId, setCompanyId] = useState<number>(0);
  const event_id = String(params.id);
  const [opened, { open, close }] = useDisclosure(false);
  const { setLink } = useLinkStore();

  const handleOpen = (id: number) => {
    setCompanyId(id);
    open();
  };

  const handleCloseFunc = (success?: boolean, data?: string) => {
    if (success) {
      toast.success(data);
    } else {
      toast.error(data);
    }
    fetchSponsors();
    close();
  };

  const handleClose = () => {
    fetchSponsors();
    close();
  };

  const fetchSponsors = async () => {
    try {
      const data = await getSponsorsByEvent(accessToken, event_id);
      const rowData = data.sponsorships.map((sponsor, _key) => {
        return {
          id: Number(sponsor.company),
          name: sponsor.poc?.name || "None",
          company_name: sponsor.company_name,
          added_by: sponsor.user_name,
          status: sponsor.status,
        };
      });
      setSponsors(rowData);
      setLink([
        { href: "/team", title: "My Team" },
        { href: `/team/${event_id}/dashboard`, title: data.event.name },
        { href: `/team/${event_id}/sponsorships`, title: "Sponsorships" },
      ]);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (org.id !== 0) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = sponsors.map((row) => (
    <Table.Tr
      key={row.id}
      onClick={() => {
        console.log(row.id);
        handleOpen(row.id);
      }}
      className=" border-b cursor-pointer hover:bg-[#6c6c6c66] rounded-md"
    >
      <Table.Td>{row.company_name}</Table.Td>=
      <Table.Td className="text-center">{row.name}</Table.Td>
      <Table.Td className="text-center">
        <p className="bg-[#F6F6F6] min-w-[10rem] w-fit m-auto text-center p-2 px-4 rounded-full">
          {row.added_by}
        </p>
      </Table.Td>
      <Table.Td className="text-center">
        <p
          className={`
        ${row.status === "No Reply" ? "bg-[#cef6e1] text-[#3AB876]" : ""}
        ${row.status === "Accepted" ? "bg-[#fedcd4] text-[#F46E47]" : ""}
        ${row.status === "Rejected" ? "bg-[#fff3cf] text-[#ffca11]" : ""}
        ${row.status === "In Progress" ? "bg-[#D1C5FF] text-[#7F5DFF]" : ""}
        ${row.status === "Not Contacted" ? "bg-[#d4d5d5] text-[#414141]" : ""}
        py-2 rounded-full w-[10rem] m-auto`}
        >
          {row.status}
        </p>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <ToastContainer />
      <div className="h-full absolute max-w-full overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
        <div className="text-center gap-4 flex flex-col">
          <h1 className="text-3xl font-bold">View Sponsorships</h1>
          <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
            View, Update or Archive the Details of the Companies that have been
            recently contacted.
          </p>
        </div>
        <Table.ScrollContainer
          type="native"
          minWidth={500}
          maw={"100%"}
          mah={"70%"}
        >
          <ScrollArea className="">
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              miw={500}
              layout="fixed"
              striped
            >
              <Table.Tbody>
                <Table.Tr bg={"white"}>
                  <Table.Th>Company</Table.Th>
                  <Table.Th className="text-center">Current PoC</Table.Th>
                  <Table.Th className="text-center">Added By</Table.Th>
                  <Table.Th className="text-center">Status</Table.Th>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody className="">
                {rows.length > 0 ? (
                  rows
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text fw={500} ta="center">
                        Nothing found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
            <Modal
              classNames={{ content: "border-2 border-red-500", root: "" }}
              opened={opened}
              centered
              size="auto"
              onClose={handleClose}
              title="Modify Company Details"
              w={"100%"}
            >
              <ModifyCompany close={handleCloseFunc} company_id={companyId} />
            </Modal>
          </ScrollArea>
        </Table.ScrollContainer>
        <div className={`w-full flex flex-row items-center justify-center`}>
          <Link
            href={`/team/${event_id}/sponsorships/createNew`}
            className="flex bg-white flex-row sticky bottom-0 items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4 z-10"
          >
            <IoMdAddCircleOutline className="text-2xl font-bold" /> Add a
            Company
          </Link>
        </div>
      </div>
    </>
  );
}
