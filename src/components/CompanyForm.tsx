"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/store/auth";
import { Paper, TextInput, Button, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { pocResp } from "@/types/org";
import { updateCompany, getPoCByCompany, addPoC } from "@/utils/organisation";
import PocTable from "./PocTable";
import { toast } from "react-toastify";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PoC } from "@/types/org";
import { useLoadingStore } from "@/store/loading";
import { FaRegSquarePlus } from "react-icons/fa6";

interface RowData {
  comp_id: number;
  name: string;
  website: string;
  industry: string;
  linkedin: string;
}

export default function ModifyCompany({
  company,
  close,
}: Readonly<{
  company: RowData;
  close: (_success?: boolean, _data?: string) => void;
}>) {
  const { role } = authStore();
  const [pocData, setPocData] = useState<pocResp[]>([]);
  const [pocCount, setPocCount] = useState<number>(0);
  const { startLoading, stopLoading } = useLoadingStore();

  const form = useForm({
    initialValues: {
      CompName: "",
      CompIndustry: "",
      CompLinkedin: "",
      CompWebsite: "",
      PoCs: [
        {
          name: "",
          designation: "",
          email: "",
          linkedin: "",
          phone: "",
        },
      ],
    },
    validate: {
      CompName: (value) => (value.length > 0 ? null : "Enter a company name"),
      CompIndustry: (value) =>
        value.length > 0 ? null : "Enter the industry of the company",
      CompLinkedin: (value) =>
        value.length > 0 ? null : "Enter the linkedin of the company",
      CompWebsite: (value) =>
        value.length > 0 ? null : "Enter the website of the company",
    },
  });

  useEffect(() => {
    form.setValues({
      CompName: company.name,
      CompIndustry: company.industry,
      CompLinkedin: company.linkedin,
      CompWebsite: company.website,
    });
    const fetchPOCs = async () => {
      try {
        const data = await getPoCByCompany(company.comp_id);
        setPocData(data);
      } catch (e: any) {
        toast.error(e.message);
      }
    };
    fetchPOCs();
  }, [company]);

  const handleUpdateCompany = async (values: any) => {
    try {
      startLoading();
      const data = {
        id: company.comp_id,
        name: values.CompName,
        industry: values.CompIndustry,
        linkedin: values.CompLinkedin,
        website: values.CompWebsite,
      };
      const _resp = await updateCompany(data, company.comp_id);
      close(true, "Company Details Updated Successfully");
      if (pocCount === 0) {
        stopLoading();
        return;
      }
      const pocData = values.PoCs.slice(0, pocCount).map((poc: PoC) => {
        return {
          name: poc.name,
          designation: poc.designation,
          email: poc.email,
          linkedin: poc.linkedin,
          phone: poc.phone,
          company: company.comp_id,
        };
      });
      try {
        const _pocResponse = await addPoC(pocData);
        toast.success("PoC Details Updated Successfully");
      } catch (error: any) {
        stopLoading();
        toast.error(error.message);
      }
    } catch (e) {
      console.error(e);
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
          Update Company Details
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={20}
        >
          Update Company Details and Add PoCs
        </Title>
        <form
          className="w-full gap-4 max-w-[800px] items-center self-center"
          onSubmit={form.onSubmit(() => {
            handleUpdateCompany(form.values);
          })}
        >
          <Title order={3} className="text-black font-bold" ta="center" mb={20}>
            Company Details
          </Title>
          <div className="flex flex-col md:flex-row w-full gap-4">
            <TextInput
              label="Name of the Company"
              placeholder="Google"
              size="md"
              w={"100%"}
              disabled={role === "admin" || role === "owner" ? false : true}
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompName")}
            />
          </div>
          <div className="flex flex-col select-none md:flex-row gap-4">
            <TextInput
              label="Industry"
              placeholder="Tech"
              size="md"
              w={"100%"}
              disabled={role === "admin" || role === "owner" ? false : true}
              classNames={{ input: "bg-white w-full" }}
              mb={10}
              {...form.getInputProps("CompIndustry")}
            />

            <TextInput
              label="Linkedin"
              placeholder="https://www.linkedin.com/company/dscvit/"
              size="md"
              w={"100%"}
              disabled={role === "admin" || role === "owner" ? false : true}
              mb={10}
              {...form.getInputProps("CompLinkedin")}
            />
          </div>
          <TextInput
            label="Company's Website"
            placeholder="https://dscvit.com"
            size="md"
            mb={10}
            disabled={role === "admin" || role === "owner" ? false : true}
            {...form.getInputProps("CompWebsite")}
          />
          <div className="flex flex-row w-full items-center justify-center gap-8">
            <Title
              order={3}
              className="text-black font-bold"
              ta="center"
              mt="xl"
              mb={20}
            >
              PoC Details
            </Title>
            <FaRegSquarePlus
              className="text-[#191919] text-3xl mt-4 h-full self-center cursor-pointer hover:text-blue-700"
              onClick={() => {
                setPocCount(pocCount + 1);
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
            />
          </div>
          <PocTable pocData={pocData} checkbox={false} />
          {Array.from({ length: pocCount }).map((_, index) => (
            <div key={index}>
              <div className="flex flex-row w-full justify-between">
                <TextInput
                  label={`Name of PoC ${index + 1}`}
                  placeholder="Dhruv Shah"
                  size="md"
                  w={"100%"}
                  mb={10}
                  classNames={{ input: "bg-white w-full" }}
                  {...form.getInputProps(`PoCs.${index}.name`)}
                />
                <MdOutlineDeleteForever
                  className="text-[#191919] text-3xl mt-4 h-full self-center cursor-pointer hover:text-red-400"
                  onClick={() => {
                    form.setValues((values) => {
                      if (values.PoCs !== undefined) {
                        return {
                          ...values,
                          PoCs: values.PoCs.filter((_, i) => i !== index),
                        };
                      } else {
                        return {
                          ...values,
                        };
                      }
                    });
                    setPocCount(pocCount - 1);
                  }}
                />
              </div>
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
                  placeholder="https://linkedin.com/in/dhruvshah"
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
                  placeholder="9954672314"
                  size="md"
                  w={"100%"}
                  classNames={{ input: "bg-white w-full" }}
                  mb={10}
                  {...form.getInputProps(`PoCs.${index}.phone`)}
                />
                <TextInput
                  label="Email Address"
                  placeholder="dhruv.shah@gmail.com"
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
              className="bg-blue-500 w-full max-w-[20rem] md:w-[40%] self-center hover:bg-blue-400"
              type="submit"
              size="md"
            >
              Save Details
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
