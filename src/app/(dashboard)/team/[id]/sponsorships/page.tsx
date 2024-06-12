"use client";

import { getSponsorsByEvent } from "@/utils/organisation";

import { Table, ScrollArea, Text, Modal, Title, keys, TextInput, rem } from "@mantine/core";
import { useState, useEffect } from "react";
import { organisationStore } from "@/store/organisation";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import ModifySponsorship from "@/components/SponsorshipForm";
import { toast } from "react-toastify";
import { useLinkStore } from "@/store/crumbs";
import { pocResp } from "@/types/org";
import { IconSearch } from "@tabler/icons-react";

interface RowData {
  spon_id: number;
  comp_id: number;
  poc: string | pocResp;
  company_name: string;
  added_by: string;
  status: string;
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      String(item[key])?.toLowerCase().includes(query)
    )
  );
}

export default function Home({ params }: Readonly<{ params: { id: number } }>) {
  const { org } = organisationStore();

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<RowData[]>([]);
  const [sponsors, setSponsors] = useState<RowData[]>([]);
  const [companyId, setCompanyId] = useState<number>(0);
  const event_id = String(params.id);
  const [opened, { open, close }] = useDisclosure(false);
  const { setLink } = useLinkStore();

  const handleOpen = (id: number) => {
    setCompanyId(id);
    open();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    setFilteredData(filterData(sponsors, value));
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
      const data = await getSponsorsByEvent(event_id);
      const rowData = data.sponsorships.map((sponsor, _key) => {
        return {
          spon_id: Number(sponsor.id),
          comp_id: Number(sponsor.company),
          poc: sponsor.poc_name ?? "None",
          company_name: sponsor.company_name,
          added_by: sponsor.user_name,
          status: sponsor.status,
        };
      });
      setSponsors(rowData);
      setFilteredData(rowData);
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

  const rows = filteredData.map((row) => (
    <Table.Tr
      key={row.spon_id}
      onClick={() => {
        console.log(row.spon_id);
        handleOpen(row.comp_id);
      }}
      className=" border-b cursor-pointer hover:bg-[#6c6c6c66] rounded-md"
    >
      <Table.Td>{row.company_name}</Table.Td>
      <Table.Td className="text-center">
        {typeof row.poc === "object" ? row.poc.name : row.poc}
      </Table.Td>
      <Table.Td className="text-center">
        <p className="bg-[#F6F6F6] min-w-[10rem] w-fit m-auto text-center p-2 px-4 rounded-full">
          {row.added_by}
        </p>
      </Table.Td>
      <Table.Td className="text-center">
        <p className={`${row.status} py-2 rounded-full w-[10rem] m-auto`}>
          {row.status}
        </p>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="h-full absolute max-w-full overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
        <div className="text-center gap-4 flex flex-col">
          <Title order={1} className="text-black font-bold" ta="center" mt="md">
            View Sponsorships
          </Title>
          <Title
            className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
            mt={10}
            mb={30}
          >
            View and Update the Details of the Companies that have been recently
            contacted.
          </Title>
        </div>
        <TextInput
          placeholder="Search by any field"
          w={"100%"}
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
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
              <ModifySponsorship
                close={handleCloseFunc}
                company_id={companyId}
              />
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
