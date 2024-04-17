"use client";
import { authStore } from "@/store/auth";
import { getSponsorsByEvent } from "@/utils/organisation";

import {
  Table,
  ScrollArea,
  Text,
  Modal,
  HoverCard,
  Button,
  Accordion,
  ActionIcon,
  AccordionControlProps,
  Center,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { organisationStore } from "@/store/organisation";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import ModifyCompany from "@/components/companyForm";
import { IconDots } from "@tabler/icons-react";

interface RowData {
  id: number;
  name: string;
  company_name: string;
  added_by: string;
  status: string;
}

function AccordionControl(props: AccordionControlProps) {
  return (
    <Center>
      <Accordion.Control {...props} />
      <ActionIcon size="lg" variant="subtle" color="gray">
        <IconDots size="1rem" />
      </ActionIcon>
    </Center>
  );
}

export default function Home() {
  const { accessToken } = authStore();
  const { org } = organisationStore();
  const [sponsors, setSponsors] = useState<RowData[]>([]);
  const [companyId, setCompanyId] = useState<number>(0);
  const event_id = usePathname().split("/")[2];
  const [opened, { open, close }] = useDisclosure(false);

  const handleOpen = (id: number) => {
    setCompanyId(id);
    open();
  };

  const handleClose = () => {
    fetchSponsors();
    close();
  };

  const fetchSponsors = async () => {
    try {
      const data = await getSponsorsByEvent(accessToken, event_id);
      const rowData = data.sponsorships.map((sponsor, key) => {
        return {
          id: Number(sponsor.company),
          name: sponsor.poc?.name || "",
          company_name: sponsor.company_name,
          added_by: sponsor.user_name,
          status: sponsor.status,
        };
      });
      setSponsors(rowData);
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
      className=" border-b cursor-pointer hover:bg-[#6c6c6c66] rounded-md border-black"
    >
      <Table.Td>{row.company_name}</Table.Td>
      {/* <Table.Td className="text-center">{row.company_name}</Table.Td> */}
      <Table.Td className="text-center">{row.name}</Table.Td>
      <Table.Td className="text-center">
        <span className="bg-[#F6F6F6] p-2 px-4 rounded-full">
          {row.added_by}
        </span>
      </Table.Td>
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
    <>
      <div className="h-full absolute max-w-full overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold">View Sponsorships</h1>
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
          minWidth={500}
          maw={"100%"}
          mah={"70%"}
        >
          <ScrollArea className="">
            {/* <div
        className="min-w-700 overflow-scroll max-w-full"  
      > */}
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
                  {/* <Table.Th className="text-center">Company PoC</Table.Th> */}
                  <Table.Th className="text-center">Last Updated</Table.Th>
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
            {/* </div> */}
            <Modal
              classNames={{ content: "border-2 border-red-500", root: "" }}
              opened={opened}
              centered
              size="auto"
              onClose={handleClose}
              title="Modify User Role"
              w={"100%"}
            >
              <ModifyCompany company_id={companyId} />
            </Modal>
          </ScrollArea>
        </Table.ScrollContainer>
        <div className={`w-full flex flex-row items-center justify-center`}>
          <Link
            href={`/team/${event_id}/sponsorships/createNew`}
            // onClick={() => {
            //   router.push(`/team/${event_id}/sponsorships/createNew`);
            // }}
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
