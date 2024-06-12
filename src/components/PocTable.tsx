import { Table, ScrollArea, Text, Checkbox, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { pocResp } from "@/types/org";
import cx from "clsx";
import classes from "@/styles/TableSelection.module.css";
import { IoAddCircleOutline } from "react-icons/io5";
import { UseFormReturnType } from "@mantine/form";

export default function PocTable({
  checkbox,
  pocData,
  setPoc,
}: {
  checkbox: boolean;
  pocData: pocResp[];
  setPoc?: (id: number) => void;
}) {
  const [selection, setSelection] = useState(0); // Initialize selection with currPoc or 0

  const toggleRow = (id: number) => {
    setSelection(id);
    if (setPoc) setPoc(id);
  };

  
  const rows = pocData.map((item) => {
    const selected = selection === item.id;
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        {checkbox && (
          <Table.Td>
            <Checkbox checked={selected} onChange={() => toggleRow(item.id)}/>

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
    <Table.ScrollContainer type="native" minWidth={1000} maw={"100%"}>
      <ScrollArea className="mb-4" maw={"100%"}>
        <Table miw={1000} verticalSpacing="sm">
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
              rows.concat(
                <Table.Tr className="hover:bg-[#c4c4c4] w-full hover:cursor-pointer">
                  <Table.Td colSpan={6} align="center">
                    <button className="flex font-semibold gap-2 text-[1rem] flex-row items-center justify-center">
                      <IoAddCircleOutline className="text-[1.5rem]" />
                      Add POCs {}
                    </button>
                  </Table.Td>
                </Table.Tr>
              )
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Table.ScrollContainer>
  );
}
