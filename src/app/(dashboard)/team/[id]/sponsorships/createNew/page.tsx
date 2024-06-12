"use client";

import { useState } from "react";
import { authStore } from "@/store/auth";
import { Paper, TextInput, Button, Title, Autocomplete } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  addCompany,
  addPoC,
  fetchAllCompanies,
  getPoCByCompany,
} from "@/utils/organisation";
import { usePathname } from "next/navigation";
import { companyByOrg, pocResp, PoC } from "@/types/org";
import { useLoadingStore } from "@/store/loading";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useLinkStore } from "@/store/crumbs";
import PocTable from "@/components/PocTable";

export default function CreateEvent() {
  const { organisation } = authStore();
  const [pocCount, setPocCount] = useState<number>(0);
  const [pocData, setPocData] = useState<pocResp[]>([]);
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<companyByOrg[] | null>([]);
  const [currCompanyId, setCurrCompanyId] = useState<number>(0);
  const { startLoading, stopLoading } = useLoadingStore();
  const router = useRouter();
  const { setLink } = useLinkStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const resp = await fetchAllCompanies( Number(organisation));
        if (resp.length === 0) {
          setData(null);
        } else {
          setData(resp);
        }
        setLink([
          { href: "/team", title: "My Team" },
          { href: `/team/${event_id}/dashboard`, title: "Event Dashboard" },
          { href: `/team/${event_id}/sponsorships`, title: "Sponsorships" },
          {
            href: `/team/${event_id}/sponsorships/createNew`,
            title: "New Spons",
          },
        ]);
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchPOCs = async () => {
      try {
        const resp = await getPoCByCompany( currCompanyId);
        setPocData(resp);
      } catch (error: any) {
        console.error(error);
      }
    };
    if (currCompanyId !== 0) fetchPOCs();
  }, [currCompanyId]);

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
    validate: {
      CompName: (value) => (value.length > 0 ? null : "Enter a company name"),
      CompIndustry: (value) =>
        value.length > 0 ? null : "Enter the industry of the company",
      CompLinkedin: (value) =>
        value.length > 0 ? null : "Enter the linkedin of the company",
      CompWebsite: (value) =>
        value.length > 0 ? null : "Enter the website of the company",
      // PoCs: {
      //   name: (value) => (value.length > 0 ? null : "Enter a name"),
      //   designation: (value) =>
      //     value.length > 0 ? null : "Enter a designation",
      // linkedin: (value, values) => (value.length || values.PoCs[Number(0)].email.length || values.PoCs[Number(0)].phone.length > 0 ? null : "Enter a linkedin"),
      // phone: (value) => (value.length > 0 ? null : "Enter a phone number"),
      // email: (value) => (value.length > 0 ? null : "Enter an email"),
      // },
    },
  });

  const handleCreateCompany = async (values: any) => {
    console.log("inside handleCreateCompany");
    startLoading();
    try {
      const company = {
        name: values.CompName,
        website: values.CompWebsite,
        linkedin: values.CompLinkedin,
        industry: values.CompIndustry,
        event_id: event_id,
      };
      const compResp = await addCompany( company);
      toast.success("Company created successfully");
      const pocData = values.PoCs.slice(0, pocCount).map((poc: PoC) => {
        return {
          name: poc.name,
          designation: poc.designation,
          email: poc.email,
          linkedin: poc.linkedin,
          phone: poc.phone,
          company: compResp.company.id,
          event: Number(event_id),
        };
      });
      try {
        const _pocResponse = await addPoC( pocData);
        stopLoading();
      } catch (error: any) {
        stopLoading();
        toast.error("Failed to add PoC");
      }
      toast.success("PoC added successfully");
      setTimeout(() => {
        router.push(`/team/${event_id}/sponsorships`);
      }, 700);
    } catch (error: any) {
      stopLoading();
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white absolute w-full p-4 rounded-md">
      <Paper className="h-full min-h-[rem(800)px] flex flex-col items-center justify-center w-full min-w-[rem(200px)]">
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={16}
        >
          Add a Sponsorship
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={50}
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
            {data === null || data.length === 0 ? (
              <TextInput
                label="Name of the Company"
                placeholder="Google"
                size="md"
                w={"100%"}
                classNames={{ input: "bg-white w-full" }}
                mb={10}
                {...form.getInputProps("CompName")}
              />
            ) : (
              <Autocomplete
                label="Name of the Company"
                placeholder="Google"
                data={
                  data
                    ? data.map((item) => ({
                        label: item.name,
                        value: item.id.toString(),
                      }))
                    : []
                }
                autoComplete="on"
                size="md"
                w={"100%"}
                limit={5}
                mb={10}
                classNames={{ input: "bg-white w-full" }}
                selectFirstOptionOnChange
                onOptionSubmit={(value) => {
                  if (data === null) return;
                  const comp = data.find((item) => item.id === Number(value));
                  setCurrCompanyId(Number(value));
                  form.setValues((values) => {
                    return {
                      ...values,
                      CompName: comp?.name,
                      CompIndustry: comp?.industry,
                      CompLinkedin: comp?.linkedin,
                      CompWebsite: comp?.website,
                    };
                  });
                }}
                {...form.getInputProps("CompName")}
              />
            )}
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
          <h2>Existing POCs</h2>
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
              className="bg-[#606060] w-full max-w-[20rem] md:w-[40%] self-center hover:bg-[#60606099]"
              size="md"
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
            >
              Add PoC
            </Button>
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
