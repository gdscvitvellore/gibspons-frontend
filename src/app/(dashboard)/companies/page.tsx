"use client";

import { fetchAllCompanies } from "@/utils/organisation";

import { Table, ScrollArea, Text, Modal, keys, TextInput, rem } from "@mantine/core";
import { useState, useEffect } from "react";
import { organisationStore } from "@/store/organisation";
import { useDisclosure } from "@mantine/hooks";
import ModifyCompany from "@/components/CompanyForm";
import { toast } from "react-toastify";
import { useLinkStore } from "@/store/crumbs";
import { IconSearch } from "@tabler/icons-react";

interface RowData {
  comp_id: number;
  name: string;
  website: string;
  industry: string;
  linkedin: string;
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
  const [company, setCompany] = useState<RowData>({
    comp_id: 0,
    name: "",
    website: "",
    industry: "",
    linkedin: "",
  });
  const event_id = String(params.id);
  const [opened, { open, close }] = useDisclosure(false);
  const { setLink } = useLinkStore();

  const handleOpen = (data: RowData) => {
    setCompany(data);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    setFilteredData(filterData(sponsors, value));
  };

  const handleClose = () => {
    fetchSponsors();
    close();
  };

  const fetchSponsors = async () => {
    try {
      const data = await fetchAllCompanies( org.id);
      const rowData = data.map((company, _key) => {
        return {
          comp_id: company.id,
          name: company.name,
          website: company.website,
          industry: company.industry,
          linkedin: company.linkedin,
        };
      });
      setSponsors(rowData);
      setFilteredData(rowData);
      setLink([
        { href: "/team", title: "My Team" },
        { href: `/team/${event_id}/companies`, title: "Companies" },
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
      key={row.comp_id}
      onClick={() => {
        console.log(row.comp_id);
        handleOpen(row);
      }}
      className=" border-b cursor-pointer hover:bg-[#6c6c6c66] rounded-md"
    >
      <Table.Td>{row.name}</Table.Td>
      <Table.Td className="text-center">{row.website}</Table.Td>
      <Table.Td className="text-center">{row.industry}</Table.Td>
      <Table.Td className="text-center">{row.linkedin}</Table.Td>
    </Table.Tr>
  ));

  return (
      <div className="h-full absolute max-w-full overflow-x-auto bg-white rounded-md gap-8 flex flex-col items-center p-4">
        <div className="text-center gap-4 flex flex-col">
          <h1 className="text-3xl font-bold">View and Manage all Companies</h1>
          <p className="text-gray-500 text-sm w-full max-w-[400px] text-center">
            View and Update the Details of the Companies that is added under the
            organisation
          </p>
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
                  <Table.Th>Company Name</Table.Th>
                  <Table.Th className="text-center">Website</Table.Th>
                  <Table.Th className="text-center">Industry</Table.Th>
                  <Table.Th className="text-center">Linkedin</Table.Th>
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
              <ModifyCompany close={handleCloseFunc} company={company} />
            </Modal>
          </ScrollArea>
        </Table.ScrollContainer>
        {/* <div className={`w-full flex flex-row items-center justify-center`}>
          <Link
            href={`/companies/createNew`}
            className="flex bg-white flex-row sticky bottom-0 items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4 z-10"
          >
            <IoMdAddCircleOutline className="text-2xl font-bold" /> Add new Company
          </Link>
        </div> */}
      </div>
  );
}
