import { Table, ScrollArea, Text, Checkbox, rem } from "@mantine/core";
import { useState } from "react";
import { pocResp } from "@/types/org";
import cx from "clsx";
import classes from "@/styles/TableSelection.module.css";

export default function PocTable({
  checkbox,
  pocData,
  setPoc,
}: {
  checkbox: boolean;
  pocData: pocResp[];
  setPoc?: (id: number) => void;
}) {
  const [selection, setSelection] = useState(0);
  const toggleRow = (id: number) => {
    setSelection(id);
    if (setPoc) setPoc(id);
  };

  const rows = pocData.map((item) => {
    const selected = selection == item.id;
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        {checkbox && (
          <Table.Td>
            <Checkbox checked={selected} onChange={() => toggleRow(item.id)} />
          </Table.Td>
        )}
        <Table.Td>
          <Text size="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>
        <Table.Td>{item.designation}</Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.phone}</Table.Td>
        <Table.Td>{item.linkedin}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer type="native" minWidth={900} maw={"100%"}>
      <ScrollArea className="mb-4" maw={"100%"}>
        <Table miw={900} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              {checkbox && (
                <Table.Th style={{ width: rem(40) }}>
                  <Checkbox checked={true} />
                </Table.Th>
              )}
              <Table.Th>Name</Table.Th>
              <Table.Th>Designation</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Linkedin</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pocData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6} align="center">
                  No POCs found
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Table.ScrollContainer>
  );
}
