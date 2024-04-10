"use client";
import { authStore } from "@/store/auth";
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Input,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createEvent } from "@/utils/events";
import { ToastContainer, ToastItem, toast } from "react-toastify";

export default function CreateEvent() {
  const { accessToken } = authStore();

  const form = useForm({
    initialValues: {
      name: "",
      startDate: null,
      endDate: null,
      ExpReg: null,
      Desc: "",
      EventLogo: "",
      SponBrochure: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Enter Email ID"),
      startDate: (value) => (value ? null : "Enter A Start Date"),
      endDate: (value) => (value ? null : "Enter an End Date"),
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
      date_of_event: form.values.startDate,
      // endDate: form.values.endDate,
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
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={50}
        >
          Create a New Event
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={50}
        >
          Fill in the details of the event, to able to store and log all your
          mails pertaining to a particular event, at a single place.
        </Title>
        <form
          className="w-full gap-4 max-w-[500px] items-center self-center"
          onSubmit={form.onSubmit(handleCreateEvent)}
        >
          <TextInput
            label="Name"
            placeholder="XYZ Solution Pvt. Ltd."
            size="md"
            classNames={{ input: "bg-white w-full" }}
            mb={16}
            {...form.getInputProps("name")}
          />
          <div className="flex flex-col select-none mb-4 md:flex-row gap-4">
            <Input.Wrapper
              label="Start Date"
              className="w-full"
              classNames={{ label: "text-[14px] font-[500]" }}
              {...form.getInputProps("startDate")}
            >
              <Input
                type="date"
                size="md"
                placeholder=""
                className="select-none"
                {...form.getInputProps("startDate")}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="End Date"
              className="w-full"
              classNames={{ label: "text-[14px] font-[500]" }}
              {...form.getInputProps("endDate")}
            >
              <Input
                type="date"
                size="md"
                classNames={{ input: " text" }}
                {...form.getInputProps("endDate")}
              />
            </Input.Wrapper>
            {/* <DateInput
                label="Date input"
                placeholder="Date input"
                size="md"
                w={'100%'}
                clearable
                withAsterisk
                classNames={{ input: "bg-black w-full" }}
                {...form.getInputProps("startDate")}
              />
              <DateInput
                label="Date input"
                placeholder="Date input"
                size="md"
                w={'100%'}
                clearable
                withAsterisk
                classNames={{ input:" text-black w-full" }}
                {...form.getInputProps("endDate")}
              /> */}
          </div>
          <NumberInput
            label="Expected Registrations"
            placeholder="1400"
            size="md"
            mb={16}
            allowDecimal={false}
            allowNegative={false}
            min={1}
            hideControls
            {...form.getInputProps("ExpReg")}
          />
          <Textarea
            label="Event Description"
            placeholder="This is a Sample Text. Fill in the details of the event, to able to store and log all your mails pertaining to a particular event, at a single place."
            size="md"
            autosize
            mb={16}
            minRows={2}
            {...form.getInputProps("Desc")}
          />
          <div className="w-full flex flex-col md:flex-row gap-4">
            <TextInput
              label="Event Logo"
              placeholder="Logo URL"
              size="md"
              w={"100%"}
              classNames={{ input: "w-full" }}
              {...form.getInputProps("EventLogo")}
            />
            <TextInput
              label="Sponsorship Brochure"
              placeholder="Brochure URL"
              w={"100%"}
              classNames={{ input: "w-full" }}
              size="md"
              {...form.getInputProps("SponBrochure")}
            />
          </div>
          <div className="w-full my-8 text-center items-center">
            <Button
              mt="xl"
              className="bg-blue-500 w-full self-center hover:bg-blue-400"
              type="submit"
              size="md"
              w="40%"
            >
              Create Event
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
}
