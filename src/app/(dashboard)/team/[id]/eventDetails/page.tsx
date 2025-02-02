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
import { useForm } from "@mantine/form";
import { updateEvent, getEvents } from "@/utils/events";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { organisationStore } from "@/store/organisation";
import { Event } from "@/types/org";
import { useLinkStore } from "@/store/crumbs";

export default function CreateEvent({
  params,
}: Readonly<{ params: { id: number } }>) {
  const { role } = authStore();
  const { org } = organisationStore();
  const { setLink } = useLinkStore();
  const [eventsData, setEventsData] = useState<Event>({
    id: 0,
    name: "",
    start_date: "",
    end_date: "",
    expected_reg: 0,
    description: "",
    brochure: "",
    logo: "",
    money_raised: 0,
  });

  useEffect(() => {
    setLink([
      { href: "/team", title: "My Team" },
      { href: `/team/${params.id}/dashboard`, title: "Event Dashboard" },
    ]);
    const fetchEvents = async () => {
      try {
        const resp = await getEvents(params.id);
        const data = resp.results;
        setEventsData(data[0]);
        form.setValues({
          name: data[0].name,
          startDate: data[0].start_date,
          endDate: data[0].end_date,
          ExpReg: data[0].expected_reg,
          Desc: data[0].description,
          EventLogo: data[0].logo,
          SponBrochure: data[0].brochure,
        });
        setLink([
          { href: `/team`, title: org.name },
          { href: `/team/${params.id}/dashboard`, title: data[0].name },
          { href: `/team/${params.id}/eventDetails`, title: "Event Details" },
        ]);
      } catch (error: any) {
        toast.error(error);
        console.log(error);
      }
    };
    if (org.id != 0) fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm({
    initialValues: {
      name: eventsData.name,
      startDate: eventsData.start_date,
      endDate: eventsData.end_date,
      ExpReg: eventsData.expected_reg,
      Desc: eventsData.description,
      EventLogo: eventsData.logo,
      SponBrochure: eventsData.brochure,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Enter Event name"),
      startDate: (value) => (value ? null : "Enter A Start Date"),
      endDate: (value) => (value ? null : "Enter an End Date"),
      Desc: (value) => (value.length > 0 ? null : "Enter Description"),
      ExpReg: (value) => {
        if (value !== null) {
          if (Number.isInteger(value)) {
            return null;
          } else {
            return "Invalid format, Enter numbers only";
          }
        } else {
          return "Enter Expected Registrations";
        }
      },
    },
  });

  const handleUpdateEvent = async () => {
    const event = {
      name: form.values.name,
      start_date: form.values.startDate,
      end_date: form.values.endDate,
      expected_reg: form.values.ExpReg,
      description: form.values.Desc,
      ...(form.values.EventLogo && { logo: form.values.EventLogo }),
      ...(form.values.SponBrochure && {
        brochure: form.values.SponBrochure,
      }),
    };
    try {
      const _resp: Event = await updateEvent(event, eventsData.id);
      toast.success("Event Updated Successfully");
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <Paper className="h-full min-h-[rem(800)px] flex flex-col items-center justify-center w-full min-w-[rem(200px)]">
        <Title
          order={1}
          className="text-black font-bold"
          ta="center"
          mt="md"
          mb={16}
        >
          View Event Details
        </Title>
        <Title
          className="font-[500] text-[#646464] text-[1rem] text-center text-wrap w-full max-w-[500px]"
          mb={50}
        >
          Changes in the Details of the Event? Edit the details of your event
          here to ensure your emails always remain accurate.
        </Title>
        {eventsData.id != 0 ? (
          <form
            className="w-full gap-4 max-w-[500px] items-center self-center"
            onSubmit={form.onSubmit(handleUpdateEvent)}
          >
            <TextInput
              label="Name"
              placeholder="XYZ Solution Pvt. Ltd."
              size="md"
              disabled={role === "user"}
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
                  disabled={role === "user"}
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
                  disabled={role === "user"}
                  classNames={{ input: " text" }}
                  {...form.getInputProps("endDate")}
                />
              </Input.Wrapper>
            </div>
            <NumberInput
              label="Expected Registrations"
              placeholder="1400"
              size="md"
              mb={16}
              disabled={role === "user"}
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
              disabled={role === "user"}
              mb={16}
              minRows={2}
              {...form.getInputProps("Desc")}
            />
            <div className="w-full flex flex-col md:flex-row gap-4">
              <TextInput
                label="Event Logo"
                placeholder="Logo URL"
                size="md"
                disabled={role === "user"}
                w={"100%"}
                classNames={{ input: "w-full" }}
                {...form.getInputProps("EventLogo")}
              />
              <TextInput
                label="Sponsorship Brochure"
                placeholder="Brochure URL"
                w={"100%"}
                disabled={role === "user"}
                classNames={{ input: "w-full" }}
                size="md"
                {...form.getInputProps("SponBrochure")}
              />
            </div>
            <div
              className={`w-full my-8 text-center items-center ${
                role === "user" ? "hidden" : ""
              }`}
            >
              <Button
                mt="xl"
                className="bg-blue-500 w-full self-center hover:bg-blue-400"
                type="submit"
                size="md"
                w="40%"
              >
                Update Event
              </Button>
            </div>
          </form>
        ) : (
          "Loading..."
        )}
      </Paper>
    </div>
  );
}
