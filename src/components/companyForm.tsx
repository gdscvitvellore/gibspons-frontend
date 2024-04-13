"use client";

import { useState } from "react";
import { authStore } from "@/store/auth";
import { Paper, TextInput, Button, Title } from "@mantine/core";
import { useForm, FORM_INDEX } from "@mantine/form";
import { createEvent } from "@/utils/events";
import { ToastContainer, ToastItem, toast } from "react-toastify";
import { addCompany, addPoC } from "@/utils/organisation";
import { usePathname } from "next/navigation";

type PoC = {
  designation: string;
  email: string;
  linkedin: string;
  name: string;
  phone: string;
};

export default function ModifyCompany() {
  const { accessToken } = authStore();
  const [pocCount, setPocCount] = useState<number>(1);
  const event_id = usePathname().split("/")[2];

  const form = useForm({
    initialValues: {
      CompName: "",
      CompIndustry: "",
      CompLinkedin: "",
      CompWebsite: "",
      PoCs: [
        {
          designation: "",
          email: "",
          linkedin: "",
          name: "",
          phone: "",
        },
      ],
    },
  });

  const handleCreateCompany = async (values: any) => {
    try {
      const company = {
        name: values.CompName,
        website: values.CompWebsite,
        linkedin: values.CompLinkedin,
        industry: values.CompIndustry,
        event: event_id,
      };
      const compResp = await addCompany(accessToken, company);
      const pocData = values.PoCs.map((poc: PoC) => {
        return {
          name: poc.name,
          designation: poc.designation,
          email: poc.email,
          linkedin: poc.linkedin,
          phone: poc.phone,
          company: compResp.id,
          event: event_id,
        };
      });
      try {
        const pocResponse = await addPoC(accessToken, pocData);
        toast.success("Company created successfully");
      } catch (error: any) {
        toast.error("Failed to add PoC");
      }
      toast.success("PoC added successfully");
    } catch (error: any) {
      toast.error("Failed to create company");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <ToastContainer />
      <Paper className="h-full min-h-[rem(800)px] flex flex-col items-center justify-center w-full min-w-[rem(200px)]">
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={10}
        >
          Add a Company
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={20}
        >
          Store details of a company you&apos;re in talks with, to keep a track
          of sponsorships and communication, with respect to the company.
        </Title>
        <form
          className="w-full gap-4 max-w-[800px] items-center self-center"
          onSubmit={form.onSubmit(() => {
            handleCreateCompany(form.values);
          })}
        >
          <Title order={3} className="text-black font-bold" ta="center" mb={20}>
            Company Details
          </Title>
          <div className="flex flex-col select-none md:flex-row gap-4">
            <TextInput
              label="Name of the Company"
              placeholder="Google"
              size="md"
              w={"100%"}
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompName")}
            />
            <TextInput
              label="Industry"
              placeholder="Tech"
              size="md"
              w={"100%"}
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompIndustry")}
            />
          </div>
          <TextInput
            label="Company's Linkedin Page"
            placeholder="https://www.linkedin.com/company/dscvit/"
            size="md"
            mb={10}
            {...form.getInputProps("CompLinkedin")}
          />
          <TextInput
            label="Company's Website"
            placeholder="https://dscvit.com"
            size="md"
            mb={10}
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
          {Array.from({ length: pocCount }).map((_, index) => (
            <div key={index}>
              <TextInput
                label={`Name of PoC ${index + 1}`}
                placeholder="Google"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={10}
                {...form.getInputProps(`PoCs.${index}.name`)}
              />
              <div className="flex flex-col select-none md:flex-row gap-4">
                <TextInput
                  label="Designation"
                  placeholder="Marketing Head"
                  size="md"
                  w={"100%"}
                  classNames={{ input: "bg-white w-full" }}
                  mb={10}
                  {...form.getInputProps(`PoCs.${index}.designation`)}
                />
                <TextInput
                  label="Linkedin"
                  placeholder="Tech"
                  size="md"
                  w={"100%"}
                  classNames={{ input: "bg-white w-full" }}
                  mb={10}
                  {...form.getInputProps(`PoCs.${index}.linkedin`)}
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
                  {...form.getInputProps(`PoCs.${index}.phone`)}
                />
                <TextInput
                  label="Email Address"
                  placeholder="Tech"
                  size="md"
                  w={"100%"}
                  classNames={{ input: "bg-white w-full" }}
                  mb={20}
                  {...form.getInputProps(`PoCs.${index}.email`)}
                />
              </div>
            </div>
          ))}
          <div className="w-full my-8 flex flex-col md:flex-row justify-center gap-4 text-center items-center">
            <Button
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
            </Button>
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
