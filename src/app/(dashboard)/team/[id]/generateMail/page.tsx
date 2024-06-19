"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/store/auth";
import {
  Paper,
  TextInput,
  Button,
  Title,
  Textarea,
  Autocomplete,
  NativeSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { FaRegCopy } from "react-icons/fa";
import { usePathname } from "next/navigation";
import {
  fetchAllCompanies,
  getPoCByCompany,
  generateMail,
  generateLinkedin,
} from "@/utils/organisation";
import { useLoadingStore } from "@/store/loading";
import { useLinkStore } from "@/store/crumbs";

export default function CreateEvent() {
  const { organisation } = authStore();
  const event_id = usePathname().split("/")[2];
  const [data, setData] = useState<any[] | null>([]);
  const [company_id, setCompany_id] = useState<number>(0);
  const [pocData, setPocData] = useState<any[] | null>([]);
  const { startLoading, stopLoading } = useLoadingStore();
  const { setLink } = useLinkStore();

  const form = useForm({
    initialValues: {
      company: "",
      PoC: "",
      event: Number(event_id),
      communication: "email",
      additionalPrompt: "",
      poc_id: 0,
    },
    validate: {
      company: (value) => (value.length > 0 ? null : "Enter a company name"),
      PoC: (value) => (value.length > 0 ? null : "Enter a PoC name"),
    },
  });

  const formContent = useForm({
    initialValues: {
      content: "",
      add_additional_prompt: "",
    },
    validate: {
      content: (value) => (value.length > 0 ? null : "Enter a message"),
    },
  });

  useEffect(() => {
    setLink([
      { href: "/team", title: "My Team" },
      { href: `/team/${organisation}/dashboard`, title: "Dashboard" },
      { href: `/team/${organisation}/generateMail`, title: "Generate Mail" },
    ]);
    const fetchCompanies = async () => {
      try {
        const resp = await fetchAllCompanies(Number(organisation));
        if (resp.length === 0) {
          setData(null);
        } else {
          setData(resp);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    if (Number(organisation) === 0) return;
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (company_id === 0) return;
    const fetchPoC = async () => {
      try {
        const resp = await getPoCByCompany(company_id);
        if (resp.length === 0) {
          setPocData(null);
        } else {
          setPocData(resp);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    if (Number(organisation) === 0) return;
    fetchPoC();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company_id]);

  const handleGenerate = async () => {
    if (form.values.communication === "email") {
      startLoading();
      try {
        const resp = await generateMail(
          form.values.poc_id,
          form.values.event,
          form.values.additionalPrompt
        );
        console.log(resp)
        formContent.setValues({ ...form.values, content: resp.message });
        stopLoading();
      } catch (error: any) {
        stopLoading();
        toast.error(error.message);
      }
    } else {
      try {
        startLoading();
        const resp = await generateLinkedin(
          form.values.poc_id,
          form.values.event,
          form.values.additionalPrompt
        );
        formContent.setValues({ ...form.values, content: resp.message });
        stopLoading();
      } catch (error: any) {
        stopLoading();
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <Paper className="h-full min-h-[rem(800)px] flex flex-col items-center justify-center w-full min-w-[rem(200px)]">
        <Title order={1} className="text-black font-bold" ta="center" mt="md">
          Generate a Mail
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mt={10}
          mb={50}
        >
          Select a Company, the respective PoC you want to contact, and event
          you&apos;re contacting them for.
        </Title>
        <form
          className="w-full gap-4 max-w-[900px] items-center self-center"
          onSubmit={form.onSubmit(() => {
            // handleGenerate
            handleGenerate();
          })}
        >
          <div className="flex flex-col select-none mb-4 md:flex-row gap-4">
            <Autocomplete
              label="Name of the Company"
              placeholder="Google"
              data={data ? data.map((item) => item.name) : []}
              autoComplete="on"
              size="md"
              w={"100%"}
              limit={5}
              mb={10}
              classNames={{ input: "bg-white w-full" }}
              selectFirstOptionOnChange
              onOptionSubmit={(value) => {
                if (data === null) return;
                const comp = data.find((item) => item.name === value);
                setCompany_id(comp.id);
              }}
              // onChange={(value) => console.log(value)}
              {...form.getInputProps("company")}
            />
            <Autocomplete
              label="PoC"
              placeholder="Rupaak"
              data={pocData ? pocData.map((item) => item.name) : []}
              autoComplete="on"
              size="md"
              w={"100%"}
              limit={5}
              mb={10}
              classNames={{ input: "bg-white w-full" }}
              selectFirstOptionOnChange
              onOptionSubmit={(value) => {
                if (pocData === null) return;
                const poc = pocData.find((item) => item.name === value);
                form.setValues({
                  ...form.values,
                  PoC: poc.name,
                  poc_id: poc.id,
                });
              }}
              {...form.getInputProps("PoC")}
            />
          </div>
          <div className="w-full mb-4 flex flex-col md:flex-row gap-4">
            <TextInput
              label="Event ID"
              placeholder=""
              size="md"
              w={"100%"}
              disabled
              classNames={{ input: "w-full" }}
              {...form.getInputProps("event")}
            />
            <NativeSelect
              label="Communication"
              defaultValue={"email"}
              data={[
                { value: "email", label: "Email" },
                { value: "linkedin", label: "LinkedIn" },
              ]}
              w={"100%"}
              classNames={{ input: "w-full" }}
              size="md"
              {...form.getInputProps("communication")}
            />
          </div>
          <Textarea
            label="Additional Prompt (Optional)"
            placeholder="Make it shorter and more crispy etc ..."
            size="md"
            autosize
            mb={16}
            {...form.getInputProps("additionalPrompt")}
          />
          <div className="w-full my-8 text-center items-center">
            <Button
              className="bg-blue-500 p-2 px-4 self-center hover:bg-blue-400"
              type="submit"
              size="md"
              // w="100%"
            >
              Generate
            </Button>
          </div>
        </form>
        <div className={`w-full h-8 flex flex-row justify-between items-center max-w-[900px] ${formContent.values.content.length === 0 ? "hidden" : ""}`}>
            <p className="font-[500]">Draft</p>
          <FaRegCopy
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(formContent.values.content);
              toast.success("Copied to clipboard");
            }}
          />
        </div>
        <form
          className={`w-full gap-4 max-w-[900px] items-center self-center ${formContent.values.content.length === 0 ? "hidden" : ""}`}
          // onSubmit={formContent.onSubmit(() => {
          //   console.log("hello");
          // })}
        >
          <Textarea
            // label="Draft"
            placeholder="Hello {PoC}, I'm reaching out to you on behalf of {Company} for {Event}."
            size="md"
            autosize
            mb={16}
            {...formContent.getInputProps("content")}
          />
          {/* <Textarea
            label="Additional Prompt (Optional)"
            placeholder="Make it shorter and more crispy etc ..."
            size="md"
            autosize
            mb={16}
            {...formContent.getInputProps("add_additional_prompt")}
          />
          <div className="w-full text-center items-center flex flex-row justify-center">
            <button
              type="submit"
              className="flex bg-white flex-row items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4"
            >
              <BiRefresh className="text-2xl font-bold" /> Create New Event
            </button>
          </div> */}
        </form>
      </Paper>
    </div>
  );
}
