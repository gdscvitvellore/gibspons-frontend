"use client";
import { authStore } from "@/store/auth";
import {
  Paper,
  TextInput,
  Button,
  Title,
  Input,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useForm } from "@mantine/form";
import { createEvent } from "@/utils/events";
import { ToastContainer, ToastItem, toast } from "react-toastify";
import { FaRegCopy } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { BiRefresh } from "react-icons/bi";

export default function CreateEvent() {
  const { accessToken } = authStore();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      ExpReg: null,
      Desc: "",
      EventLogo: "",
      SponBrochure: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Enter Email ID"),
      startDate: (value) => (value ? null : "Enter A Start Date"),
      endDate: (value) => (value ? null : "Enter an End Date"),
      Desc: (value) =>
        value.length > 0 ? null : "Description can not be blank",
      ExpReg: (value) =>
        value !== null
          ? Number.isInteger(value)
            ? null
            : "Invalid format, Enter numbers only"
          : "Enter Expected Registrations",
    },
  });

  const handleCreateEvent = async () => {
    const event = {
      name: form.values.name,
      start_date: form.values.startDate,
      end_date: form.values.endDate,
      expected_reg: form.values.ExpReg,
      description: form.values.Desc,
      ...(form.values.EventLogo && { EventLogo: form.values.EventLogo }),
      ...(form.values.SponBrochure && {
        SponBrochure: form.values.SponBrochure,
      }),
    };
    try {
      const resp = await createEvent(accessToken, event);
      toast.success("Event Created Successfully");
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <ToastContainer />
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
          onSubmit={form.onSubmit(handleCreateEvent)}
        >
          <div className="flex flex-col select-none mb-4 md:flex-row gap-4">
            <TextInput
              label="Company"
              placeholder="Google"
              size="md"
              w={"100%"}
              classNames={{ input: "w-full" }}
              {...form.getInputProps("EventLogo")}
            />
            <TextInput
              label="PoC"
              placeholder="Sundar Pichai"
              size="md"
              w={"100%"}
              classNames={{ input: "w-full" }}
              {...form.getInputProps("EventLogo")}
            />
          </div>
          <div className="w-full mb-4 flex flex-col md:flex-row gap-4">
            <TextInput
              label="Event"
              placeholder="Hexathon '23"
              size="md"
              w={"100%"}
              classNames={{ input: "w-full" }}
              {...form.getInputProps("EventLogo")}
            />
            <TextInput
              label="Communication"
              placeholder="Select what you'd want to generate"
              w={"100%"}
              classNames={{ input: "w-full" }}
              size="md"
              {...form.getInputProps("SponBrochure")}
            />
          </div>
          <Textarea
            label="Additional Prompt (Optional)"
            placeholder="Make it shorter and more crispy etc ..."
            size="md"
            autosize
            mb={16}
            {...form.getInputProps("Desc")}
          />
          <div className="w-full my-8 text-center items-center">
            <Button
              className="bg-blue-500 w-full self-center hover:bg-blue-400"
              type="submit"
              size="md"
              w="20%"
            >
              Generate
            </Button>
          </div>
        </form>
        <div className="w-full h-12 flex flex-row justify-end max-w-[900px]">
          <FaRegCopy
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText("Hello");
              toast.success("Copied to clipboard");
            }}
          />
        </div>
        <form
          className="w-full  gap-4 max-w-[900px] items-center self-center"
          onSubmit={form.onSubmit(handleCreateEvent)}
        >
          <Textarea
            label="Draft"
            placeholder="Hello {PoC}, I'm reaching out to you on behalf of {Company} for {Event}."
            size="md"
            autosize
            mb={16}
            {...form.getInputProps("Desc")}
          />
          <Textarea
            label="Additional Prompt (Optional)"
            placeholder="Make it shorter and more crispy etc ..."
            size="md"
            autosize
            mb={16}
            {...form.getInputProps("Desc")}
          />
          <div className="w-full text-center items-center flex flex-row justify-center">
            <button
              type="submit"
              className="flex bg-white flex-row items-center gap-2 border-2 font-bold rounded-sm border-blue-500 text-blue-500 p-2 px-4"
            >
              <BiRefresh className="text-2xl font-bold" /> Create New
              Event
            </button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
