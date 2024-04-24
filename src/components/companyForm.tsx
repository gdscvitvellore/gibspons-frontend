"use client";

import { use, useEffect, useState } from "react";
import { authStore } from "@/store/auth";
import {
  Paper,
  TextInput,
  Button,
  Title,
  NativeSelect,
  Textarea,
  Autocomplete,
} from "@mantine/core";
import { useForm, FORM_INDEX } from "@mantine/form";
import { createEvent } from "@/utils/events";
import { ToastContainer, ToastItem, toast } from "react-toastify";
import {
  addCompany,
  addPoC,
  getCompanyByID,
  getPoCByCompany,
  getSponsorsByEvent,
  updateSponsorship,
} from "@/utils/organisation";
import { usePathname } from "next/navigation";
import { pocResp } from "@/types/org";

type PoC = {
  designation: string;
  email: string;
  linkedin: string;
  name: string;
  phone: string;
};

export default function ModifyCompany({ company_id }: { company_id: number }) {
  const { accessToken, organisation } = authStore();
  // const [pocCount, setPocCount] = useState<number>(1);
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<pocResp[]>([]);

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
      sponsor_id: 0,
      PoCs: {
        id: 0,
        designation: "",
        email: "",
        linkedin: "",
        name: "",
        phone: "",
      },
    },
  });

  useEffect(() => {
    const fetchSponsors = async () => {
      const comp_filtered = await getCompanyByID(
        accessToken,
        Number(organisation),
        company_id
      );
      const spon = await getSponsorsByEvent(accessToken, event_id);
      const spon_filtered = spon.sponsorships.find(
        (c) => c.company === company_id
      );
      // const comp_filtered = comp.find((c) => c.id === company_id);
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
      });
      const poc = await getPoCByCompany(accessToken, company_id);
      // setPocCount(poc.length);
      setData(poc);
    };
    if (Number(organisation) !== 0) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCompany = async (values: any) => {
    try {
      const data = {
        poc: values.PoCs.id,
        status: values.status,
        type_of_sponsorship: values.type_of_sponsorship,
        money_donated: values.money_donated,
        additional: values.additional,
      };
      const resp = await updateSponsorship(
        accessToken,
        data,
        values.sponsor_id
      );
      console.log(resp);
      toast.success("Company updated successfully");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white relative p-4 rounded-md">
      <ToastContainer />
      <Paper className="h-full relative min-h-[rem(800)px] flex flex-col items-center justify-center max-w-full w-[rem(1200px)]">
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={10}
        >
          Add Sponsorship
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={20}
        >
          Add Sponsorship and PoCs
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
            {/* <TextInput
              label="Status"
              placeholder="Accepted"
              size="md"
              w={"50%"}
              classNames={{ input: "bg-[#4d4d4d] w-full " }}
              mb={10}
              {...form.getInputProps("status")}
            /> */}
            <NativeSelect
              label="Status"
              radius="md"
              size="md"
              w="50%"
              data={[
                { label: "Select status", value: "" },
                { label: "Not Contacted", value: "Not Contacted" },
                { label: "Accepted", value: "Accepted" },
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
              classNames={{ input: "bg-[#4d4d4d] w-full " }}
              mb={10}
              {...form.getInputProps("added_by")}
            />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <NativeSelect
              label="Type of Sponsorship"
              radius="md"
              size="md"
              w="100%"
              data={[
                { label: "Select status", value: "" },
                { label: "Monetary", value: "monetary" },
                { label: "inKind", value: "inKind" },
              ]}
              {...form.getInputProps("type_of_sponsorship")}
            />
            <TextInput
              label="Money Donated"
              placeholder="10000"
              size="md"
              w={"100%"}
              classNames={{ input: "bg-white w-full " }}
              mb={10}
              {...form.getInputProps("money_donated")}
            />
          </div>
          <Textarea
            label="Additional Information"
            placeholder="Add additional information here"
            size="md"
            autosize
            minRows={2}
            mb={20}
            {...form.getInputProps("additional")}
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
          {/* {Array.from({ length: pocCount }).map((_, index) => ( */}
          <div>
            <Autocomplete
              label="Name"
              placeholder="Rupaak S"
              data={data.map((item) => ({
                label: item.name,
                // value: item.name,
                value: String(item.id),
              }))}
              autoComplete="on"
              size="md"
              w={"100%"}
              limit={5}
              mb={10}
              classNames={{ input: "bg-white w-full" }}
              selectFirstOptionOnChange
              onOptionSubmit={(value) => {
                const poc = data.find((item) => item.id === Number(value));
                if (!poc) return;
                form.setValues((values) => {
                  return {
                    ...values,
                    PoCs: {
                      id: poc.id,
                      designation: poc.designation,
                      email: poc.email,
                      linkedin: poc.linkedin,
                      name: poc.name,
                      phone: poc.phone,
                    },
                  };
                });
              }}
              // onChange={(value) => console.log(value)}
              {...form.getInputProps("PoCs.name")}
            />
            <div className="flex flex-col select-none md:flex-row gap-4">
              <TextInput
                label="Designation"
                placeholder="Marketing Head"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={10}
                {...form.getInputProps(`PoCs.designation`)}
              />
              <TextInput
                label="Linkedin"
                placeholder="Tech"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={10}
                {...form.getInputProps(`PoCs.linkedin`)}
              />
            </div>
            <div className="flex flex-col select-none md:flex-row gap-4">
              <TextInput
                label="Phone Number"
                placeholder="Google"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={10}
                {...form.getInputProps(`PoCs.phone`)}
              />
              <TextInput
                label="Email Address"
                placeholder="Tech"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={20}
                {...form.getInputProps(`PoCs.email`)}
              />
            </div>
          </div>
          <div className="w-full my-8 flex flex-col md:flex-row justify-center gap-4 text-center items-center">
            {/* <Button
              className="bg-[#606060] w-full self-center hover:bg-[#60606099]"
              size="md"
              w="40%"
              onClick={() => {
                setPocCount(pocCount + 1);
                console.log("Hello");
                form.setValues((values) => {
                  if (values.PoCs !== undefined) {
                    return {
                      ...values,
                      PoCs: values.PoCs.concat({
                        designation: "",
                        email: "",
                        linkedin: "",
                        name: "",
                        phone: "",
                      }),
                    };
                  } else {
                    return {
                      ...values,
                    };
                  }
                });
              }}
            >
              Add PoC
            </Button> */}
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
