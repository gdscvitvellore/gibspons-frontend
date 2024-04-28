"use client";

import { useState } from "react";
import { authStore } from "@/store/auth";
import { Paper, TextInput, Button, Title, Autocomplete } from "@mantine/core";
import { useEffect } from "react";
import { useForm, FORM_INDEX } from "@mantine/form";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { addCompany, addPoC, fetchAllCompanies } from "@/utils/organisation";
import { usePathname } from "next/navigation";
import { companyByOrg } from "@/types/org";
import { useLoadingStore } from "@/store/loading";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useLinkStore } from "@/store/crumbs";

type PoC = {
  designation: string;
  email: string;
  linkedin: string;
  name: string;
  phone: string;
};

export default function CreateEvent() {
  const { accessToken, organisation } = authStore();
  const [pocCount, setPocCount] = useState<number>(1);
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<companyByOrg[] | null>([]);
  const { startLoading, stopLoading } = useLoadingStore();
  const router = useRouter();
  const { setLink } = useLinkStore();

  useEffect(() => {
    if (accessToken === "") return;
    const fetchCompanies = async () => {
      try {
        const resp = await fetchAllCompanies(accessToken, Number(organisation));
        if (resp.length === 0) {
          setData(null);
        } else {
          setData(resp);
        }
        setLink([
          { href: "/team", title: "My Team" },
          { href: `/team/${event_id}/dashboard`, title: "Event Dashboard" },
          { href: `/team/${event_id}/sponsorships`, title: "Sponsorships" },
          { href: `/team/${event_id}/sponsorships/createNew`, title: "New Spons" },
        ]);
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      PoCs: {
        name: (value) => (value.length > 0 ? null : "Enter a name"),
        designation: (value) =>
          value.length > 0 ? null : "Enter a designation",
        // linkedin: (value, values) => (value.length || values.PoCs[Number(0)].email.length || values.PoCs[Number(0)].phone.length > 0 ? null : "Enter a linkedin"),
        // phone: (value) => (value.length > 0 ? null : "Enter a phone number"),
        // email: (value) => (value.length > 0 ? null : "Enter an email"),
      },
    },
  });

  const handleCreateCompany = async (values: any) => {
    startLoading();
    try {
      const company = {
        name: values.CompName,
        website: values.CompWebsite,
        linkedin: values.CompLinkedin,
        industry: values.CompIndustry,
        event_id: event_id,
      };
      const compResp = await addCompany(accessToken, company);
      const pocData = values.PoCs.map((poc: PoC) => {
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
        const pocResponse = await addPoC(accessToken, pocData);
        stopLoading();
        toast.success("Company created successfully");
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
            // console.log(form.values);
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
                // onChange={(value) => console.log(value)}
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
          {Array.from({ length: pocCount }).map((_, index) => (
            <div key={index}>
              <div className="flex flex-row w-full justify-between">
                <TextInput
                  label={`Name of PoC ${index + 1}`}
                  placeholder="Dhruv Shah"
                  size="md"
                  w={"100%"}
                  classNames={{ input: "bg-white w-full" }}
                  mb={10}
                  {...form.getInputProps(`PoCs.${index}.name`)}
                />
                <MdOutlineDeleteForever
                  className="text-red-500 text-2xl h-full self-center cursor-pointer hover:text-red-400"
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
