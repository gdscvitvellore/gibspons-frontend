import React, { useEffect, useState } from "react";

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
  Modal,
  Button,
  NativeSelect,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import { IoMdCheckmark, IoMdTrash } from "react-icons/io";
import { useForm } from "@mantine/form";
import { TbEdit } from "react-icons/tb";
import classes from "@/styles/TableSort.module.css";
import { useDisclosure } from "@mantine/hooks";
import { authStore } from "@/store/auth";
import { changeUserRole } from "@/utils/organisation";
import { toast } from "react-toastify";
import { approveUser } from "@/utils/auth";

interface RowData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
  username: string;
}

interface ThProps {
  children: React.ReactNode | null;
  reversed: boolean | null;
  colSpan?: number | 1;
  sorted: boolean | null;
  onSort(): void;
}
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key]?.toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

function Th({ children, reversed, sorted, colSpan, onSort }: Readonly<ThProps>) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th colSpan={colSpan} className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function MembersTable({
  data,
  approved,
  refresh,
}: Readonly<{
  data: RowData[];
  approved: boolean;
  refresh: () => Promise<void>;
}>) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>(data);
  const [SortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<RowData>();
  const { role } = authStore();

  const changeRoleForm = useForm({
    initialValues: {
      role: "",
    },

    validate: {
      role: (value) => (value.length > 0 ? null : "Role is required"),
    },
  });

  const setSorting = (field: keyof RowData) => {
    const reversed = field === SortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, {
        sortBy: SortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const handleModalOpen = (User: RowData) => {
    setSelectedUser(User);
    open();
  };

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleChangeRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp = await changeUserRole(
        Number(selectedUser?.id),
        changeRoleForm.values.role
      );
      toast.success(resp.detail);
      const newData = sortedData.map((item) => {
        if (item.id === selectedUser?.id) {
          return { ...item, role: changeRoleForm.values.role };
        }
        return item;
      });
      setSortedData(newData);
    } catch (error: any) {
      toast.error(error.message);
    }
    close();
    refresh();
  };

  const handleApproval = async (status: boolean, id: string) => {
    if (status === false) return close();
    const resp = await approveUser(id);
    if (resp.status === 200) {
      toast.success(`User ${status ? "approved" : "rejected"} successfully`);
    }
    close();
    refresh();
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td colSpan={2} className=" text-ellipsis overflow-clip w-full">
        {row.name}
      </Table.Td>
      <Table.Td
        miw={200}
        colSpan={2}
        className=" text-ellipsis overflow-clip w-full"
      >
        {row.email}
      </Table.Td>
      <Table.Td colSpan={2} className="">
        {row.created_at}
      </Table.Td>
      <Table.Td className="" colSpan={1}>
        {row.role}
      </Table.Td>
      {approved ? (
        role === "user" ? (
          ""
        ) : (
          <Table.Td
            colSpan={1}
            className="flex flex-row items-center justify-start"
          >
            <Button className="w-fit p-0">
              <TbEdit
                onClick={() => {
                  handleModalOpen(row);
                }}
                className="hover:bg-[#f8f9fa] text-black rounded-md cursor-pointer px-2"
                style={{ width: rem(40), height: rem(40) }}
              />
            </Button>
          </Table.Td>
        )
      ) : (
        <Table.Td className="flex flex-row items-center gap-4 justify-end">
          <IoMdCheckmark
            onClick={() => handleApproval(true, row.id)}
            className="text-green-500 cursor-pointer hover:bg-[#c1f3c8] rounded-full"
            style={{ width: rem(30), height: rem(30) }}
          />
          <IoMdTrash
            onClick={() => handleApproval(false, row.id)}
            className="text-red-500 cursor-pointer hover:bg-[#f3c1c1] rounded-full"
            style={{ width: rem(30), height: rem(30) }}
          />
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <>
      <Modal
        classNames={{ content: "border-2 border-red-500" }}
        opened={opened}
        centered
        onClose={close}
        title="Modify User Role"
      >
        <form
          className="w-full max-w-[400px] flex flex-col items-center gap-4 self-center"
          onSubmit={handleChangeRole}
        >
          Change the role of {selectedUser?.name} from {selectedUser?.role} to
          <NativeSelect
            label="Role"
            radius="md"
            size="md"
            w="100%"
            data={[
              { label: "Select New Role", value: "" },
              { label: "Owner", value: "owner" },
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
            {...changeRoleForm.getInputProps("role")}
          />
          <Button
            key="join-team"
            mt="xl"
            className="bg-blue-500  hover:bg-blue-400"
            type="submit"
            size="md"
            w="60%"
          >
            Change Role
          </Button>
        </form>
      </Modal>
      <TextInput
        placeholder="Search by any field"
        mb="md"
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
      <Table.ScrollContainer type="native" minWidth={900} maw={"100%"}>
        <ScrollArea>
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={900}
            withRowBorders
            // stripedColor="#f8f9fa"
            striped
            border={1}
            borderColor="#48484814"
            layout="fixed"
          >
            <Table.Tbody>
              <Table.Tr bg={"white"}>
                <Th
                  colSpan={2}
                  sorted={SortBy === "name"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("name")}
                >
                  Name
                </Th>
                <Th
                  colSpan={2}
                  sorted={SortBy === "email"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("email")}
                >
                  Email
                </Th>
                <Th
                  colSpan={2}
                  sorted={SortBy === "username"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("username")}
                >
                  {approved ? "Date Joined" : "Date Requested"}
                </Th>
                <Th
                  colSpan={1}
                  sorted={SortBy === "role"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("role")}
                >
                  Role
                </Th>
                {role === "user" ? (
                  ""
                ) : (
                  <Th
                    colSpan={1}
                    reversed={null}
                    sorted={null}
                    onSort={() => {}}
                  >
                    <TbEdit className="w-[40px] h-[40px] p-2" />
                  </Th>
                )}
              </Table.Tr>
            </Table.Tbody>
            <Table.Tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8}>
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
    </>
  );
}
