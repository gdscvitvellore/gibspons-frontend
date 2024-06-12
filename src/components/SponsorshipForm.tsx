"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/store/auth";
import {
  Paper,
  TextInput,
  Button,
  Title,
  NativeSelect,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import {
  getCompanyByID,
  getPoCByCompany,
  getSponsorsByEvent,
  updateSponsorship,
} from "@/utils/organisation";
import { usePathname } from "next/navigation";
import { pocResp } from "@/types/org";
import PocTable from "./PocTable";

export default function ModifySponsorship({
  company_id,
  close,
}: Readonly<{
  company_id: number;
  close: (_success?: boolean, _data?: string) => void;
}>) {
  const { organisation, role } = authStore();
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<pocResp[]>([]);
  const [currPoc, setCurrPoc] = useState(0);
  var existingPoc = 0;

  const form = useForm({
    initialValues: {
      CompName: "",
      CompIndustry: "",
      CompLinkedin: "",
      CompWebsite: "",
      type_of_sponsorship: "",
      money_donated: 0,
      additional: "",
      industry: "",
      status: "",
      added_by: "",
      remarks: "",
      isAccepted: false,
      showAdditional: false,
      sponsor_id: 0,
      poc_id: 0,
    },
  });

  useEffect(() => {
    form.setValues({
      poc_id: currPoc,
    });
  }, [currPoc]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const comp_filtered = await getCompanyByID(
          Number(organisation),
          company_id
        );
        const spon = await getSponsorsByEvent(event_id);
        const spon_filtered = spon.sponsorships.find(
          (c) => c.company === company_id
        );
        form.setValues({
          CompName: comp_filtered?.name,
          CompIndustry: comp_filtered?.industry,
          CompLinkedin: comp_filtered?.linkedin,
          CompWebsite: comp_filtered?.website,
          type_of_sponsorship: spon_filtered?.type_of_sponsorship,
          money_donated: spon_filtered?.money_donated,
          additional: spon_filtered?.additional,
          status: spon_filtered?.status,
          added_by: spon_filtered?.user_name,
          sponsor_id: spon_filtered?.id,
          remarks: spon_filtered?.remarks,
        });
        if (spon_filtered?.poc) {
          form.setValues({ poc_id: spon_filtered?.poc });
          existingPoc = spon_filtered?.poc;
        }
        if (
          spon_filtered?.status === "Accepted" &&
          spon_filtered?.type_of_sponsorship === "inkind"
        ) {
          form.setValues({
            showAdditional: true,
          });
        }
        if (spon_filtered?.status === "Accepted") {
          form.setValues({
            isAccepted: true,
          });
        }
        const poc = await getPoCByCompany(company_id);
        setData(poc);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.detail);
      }
    };
    if (Number(organisation) !== 0) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCompany = async (values: any) => {
    try {
      let data: any = {
        poc: values.poc_id,
        status: values.status,
        remarks: values.remarks,
      };
      if (data.poc === 0) {
        toast.error("Please select a PoC to update status!!");
        return;
      }
      if (form.values.isAccepted) {
        data = {
          ...data,
          additional: values.additional,
          money_donated: values.money_donated,
          type_of_sponsorship: values.type_of_sponsorship,
        };
      }
      const resp = await updateSponsorship(data, values.sponsor_id);
      console.log(resp);
      close(true, resp);
    } catch (error: any) {
      close(false, error.response);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <Paper className="h-full relative min-h-[rem(800)px] flex flex-col items-center justify-center max-w-full w-[rem(1200px)]">
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={10}
        >
          Update Sponsorship Details
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={20}
        >
          Update Sponsorship Details and Add PoCs
        </Title>
        <form
          className="w-full gap-4 max-w-[800px] items-center self-center"
          onSubmit={form.onSubmit(() => {
            handleUpdateCompany(form.values);
          })}
        >
          <Title order={3} className="text-black font-bold" ta="center" mb={20}>
            Overview
          </Title>
          <div className="flex flex-col md:flex-row w-full gap-4">
            <TextInput
              label="Name of the Company"
              placeholder="Google"
              size="md"
              w={"100%"}
              disabled
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompName")}
            />
            <NativeSelect
              label="Status"
              radius="md"
              size="md"
              w="50%"
              data={[
                { label: "Select status", value: "" },
                { label: "Not Contacted", value: "Not Contacted" },
                {
                  label: "Accepted",
                  value: "Accepted",
                  disabled: role === "user",
                },
                { label: "No Reply", value: "No Reply" },
                { label: "In Progress", value: "In Progress" },
                { label: "Rejected", value: "Rejected" },
              ]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label="Added By"
              placeholder="Rupaak S"
              size="md"
              w={"50%"}
              disabled
              classNames={{ input: "bg-[#4d4d4d] w-full " }}
              mb={10}
              {...form.getInputProps("added_by")}
            />
          </div>
          {(role === "admin" || role === "owner") && (
            <div className="flex flex-col gap-4 md:flex-row">
              <NativeSelect
                label="Type of Sponsorship"
                radius="md"
                size="md"
                w="100%"
                disabled={!form.values.isAccepted}
                data={[
                  { label: "Select status", value: "" },
                  { label: "Monetary", value: "monetary" },
                  { label: "inKind", value: "inKind" },
                ]}
                {...form.getInputProps("type_of_sponsorship")}
              />
              <TextInput
                label="Money Donated"
                placeholder="donation amount"
                size="md"
                w={"100%"}
                disabled={!form.values.isAccepted}
                classNames={{ input: "bg-white w-full " }}
                mb={10}
                {...form.getInputProps("money_donated")}
              />
            </div>
          )}
          {form.values.type_of_sponsorship === "inKind" && (
            <Textarea
              label="Additional Information"
              placeholder="Add additional information here"
              size="md"
              autosize
              minRows={2}
              mb={20}
              {...form.getInputProps("additional")}
            />
          )}
          <Textarea
            label="Remarks"
            placeholder="updates and remarks"
            size="md"
            autosize
            minRows={2}
            mb={20}
            {...form.getInputProps("remarks")}
          />
          <Title order={3} className="text-black font-bold" ta="center" mb={20}>
            Company Details
          </Title>
          <div className="flex flex-col select-none md:flex-row gap-4">
            <TextInput
              label="Industry"
              placeholder="Tech"
              size="md"
              w={"100%"}
              disabled
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompIndustry")}
            />

            <TextInput
              label="Linkedin"
              placeholder="https://www.linkedin.com/company/dscvit/"
              size="md"
              w={"100%"}
              disabled
              mb={10}
              {...form.getInputProps("CompLinkedin")}
            />
          </div>
          <TextInput
            label="Company's Website"
            placeholder="https://dscvit.com"
            size="md"
            mb={10}
            disabled
            {...form.getInputProps("CompWebsite")}
          />
          <Title
            order={3}
            className="text-black font-bold"
            ta="center"
            mt="xl"
            mb={20}
          >
            PoC Details
          </Title>
          <PocTable
            pocData={data}
            setPoc={setCurrPoc}
            checkbox={true}
            currPoc={existingPoc}
          />
          <div className="w-full my-8 flex flex-col md:flex-row justify-center gap-4 text-center items-center">
            <Button
              className="bg-blue-500 w-full self-center hover:bg-blue-400"
              type="submit"
              size="md"
              w="40%"
            >
              Save Details
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
