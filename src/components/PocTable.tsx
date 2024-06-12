import { Table, ScrollArea, Text, Checkbox, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { pocResp } from "@/types/org";
import cx from "clsx";
import classes from "@/styles/TableSelection.module.css";

export default function PocTable({
  checkbox,
  pocData,
  setPoc,
  currPoc,
}: {
  checkbox: boolean;
  pocData: pocResp[];
  setPoc?: (id: number) => void;
  currPoc?: number;
}) {
  const [pocSelected, setPocSelected] = useState(0);

  useEffect(() => {
    if(currPoc) setPocSelected(currPoc);
    // if (currPoc) form.setValues({ poc_id: currPoc });
  }, [currPoc]);

  const toggleRow = (id: number) => {
    setPocSelected(id);
    if (setPoc) setPoc(id);
  };

  const rows = pocData.map((item) => {
    const selected = pocSelected === item.id;
    return (
      <Table.Tr
        key={item.id}
        className={cx({ [classes.rowSelected]: selected })}
      >
        {checkbox && (
          <Table.Td>
            <Checkbox
              checked={selected}
              value={item.id}
              onChange={() => toggleRow(item.id)}
            />
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
                  <Checkbox indeterminate checked={true} />
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
                  No Existing POCs found
                </Table.Td>
              </Table.Tr>
            ) : (
              //  (
              //   rows.concat(
              //     <Table.Tr className="hover:bg-[#c4c4c4] w-full hover:cursor-pointer">
              //       <Table.Td colSpan={6} align="center">
              //         <button className="flex font-semibold gap-2 text-[1rem] flex-row items-center justify-center">
              //           <IoAddCircleOutline className="text-[1.5rem]" />
              //           Add POCs {}
              //         </button>
              //       </Table.Td>
              //     </Table.Tr>
              //   )
              // )
              rows
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Table.ScrollContainer>
  );
}
