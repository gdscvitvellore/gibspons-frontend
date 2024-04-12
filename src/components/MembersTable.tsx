import React, { useState } from "react";

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
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import classes from "@/styles/TableSort.module.css";

interface RowData {
  name: string;
  email: string;
  username: string;
  role: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
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

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
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

export default function MembersTable({ data }: { data: RowData[]}) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>(data);
  const [SortBy, setSortBy] = useState<keyof RowData | null>(
    null
  );
  const [reverseSortDirection, setReverseSortDirection] =
    useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed =
      field === SortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      sortData(sortedData, { sortBy: field, reversed, search })
    );
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.username}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.role}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
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
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={SortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Name
            </Th>
            <Th
              sorted={SortBy === "email"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("email")}
            >
              Email
            </Th>
            <Th
              sorted={SortBy === "username"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("username")}
            >
              Username
            </Th>
            <Th
              sorted={SortBy === "role"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("role")}
            >
              Role
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
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
    </ScrollArea>
  );
}
