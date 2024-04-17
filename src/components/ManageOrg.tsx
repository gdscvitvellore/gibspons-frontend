"use client";
import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  NativeSelect,
} from "@mantine/core";
import classes from "@/styles/manageOrg.module.css";
import { useForm } from "@mantine/form";
import { handleJoinOrg, handleCreateOrg } from "@/utils/auth";
import { getUserData } from "@/utils/auth";
import { authStore } from "@/store/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { user } from "@/types/user";
import { organisation, organisationStore } from "@/store/organisation";
import { getOrganisation } from "@/utils/organisation";

function ManageOrg() {
  const { accessToken, organisation, update, getUser } = authStore();
  const { updateOrganisation } = organisationStore();
  const [hasJoined, setHasJoined] = useState(false);
  const [createOrg, setCreateOrg] = useState(false);
  const [showCreateOrg, setShowCreateOrg] = useState(false);

  useEffect(() => {
    if (organisation !== null) {
      setHasJoined(true);
    }
  }, [organisation]);

  useEffect(() => {
    if (createOrg) {
      setShowCreateOrg(true);
    }
  }, [createOrg]);

  const form = useForm({
    initialValues: {
      orgCode: "",
    },

    validate: {
      orgCode: (value) =>
        /^[a-zA-Z0-9]{8}$/.test(value) ? null : "Invalid invite code",
    },
  });

  const CreateOrgForm = useForm({
    initialValues: {
      teamname: "",
      teamtype: "",
      location: "",
      teamlogo: "",
    },

    validate: {
      teamname: (value) => (value.length > 0 ? null : "Team name is required"),
      teamtype: (value) => (value.length > 0 ? null : "Team type is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
      teamlogo: (value) =>
        /\bhttps?:\/\/\S+?\.(jpg|jpeg|png|gif)\b/.test(value)
          ? null
          : "Enter a valid image url, supported formats are jpg, jpeg, png",
    },
  });

  const refreshData = async () => {
    //todo: put logic here once backend is updated
    const respUser: user = await getUserData(accessToken);
    const User = getUser();
    const respOrg: organisation = await getOrganisation(accessToken);
    update({
      ...User,
      organisation: respUser.organisation,
      role: respUser.role,
      is_approved: respUser.is_approved,
    });
    updateOrganisation(respOrg);
    setHasJoined(true);
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CreateOrg = async () => {
    const { teamname, teamtype, location, teamlogo } = CreateOrgForm.values;
    try {
      const res: any = await handleCreateOrg(
        teamname,
        teamtype,
        location,
        teamlogo,
        accessToken
      );
      refreshData();
      toast.success(res);
    } catch (error: any) {
      window.alert(error);
      console.log(error);
    }
  };

  const JoinOrg = async () => {
    const { orgCode } = form.values;
    try {
      const res: any = await handleJoinOrg(orgCode, accessToken);
      console.log(res);
      refreshData();
      toast.success(res);
    } catch (error: any) {
      window.alert(error);
      console.log(error);
    }
  };

  return (
    <div className="h-full">
      <ToastContainer />

      {showCreateOrg ? (
        <Paper className={classes.form} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md">
            Create Your Team
          </Title>
          <Text
            ta="center"
            mt="md"
            mb={50}
            className="w-full max-w-[400px] text-wrap text-[#646464] font-[500]"
          >
            Fill in the details of your team, to generate an invite code or link
            that you can share with the rest of your team
          </Text>
          <form
            className="w-full max-w-[400px] flex flex-col items-center gap-4 self-center"
            onSubmit={CreateOrgForm.onSubmit(CreateOrg)}
          >
            <TextInput
              label="Team Name"
              placeholder="Google Developer Student Club"
              radius="md"
              size="md"
              w="100%"
              {...CreateOrgForm.getInputProps("teamname")}
            />
            <NativeSelect
              label="Team Type"
              radius="md"
              size="md"
              w="100%"
              data={[
                { label: "Select Team Type", value: "" },
                { label: "Technical", value: "technical" },
                { label: "Marketing", value: "marketing" },
                { label: "Sales", value: "sales" },
              ]}
              {...CreateOrgForm.getInputProps("teamtype")}
            />
            <TextInput
              label="Location (optional)"
              placeholder="John Doe"
              radius="md"
              size="md"
              w="100%"
              {...CreateOrgForm.getInputProps("location")}
            />
            <TextInput
              label="Team Logo"
              placeholder="Logo URL"
              radius="md"
              size="md"
              w="100%"
              {...CreateOrgForm.getInputProps("teamlogo")}
            />
            <Button
              key="join-team"
              mt="xl"
              className="bg-blue-500  hover:bg-blue-400"
              type="submit"
              size="md"
              w="60%"
            >
              Create Team
            </Button>
          </form>
        </Paper>
      ) : hasJoined ? (
        <Paper className={classes.form} p={30}>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Your account is not associated with a team yet. Create a team or
            join an existing one to continue.
          </Title>
          <form
            className="w-full max-w-[400px] flex flex-col items-center  self-center"
            onSubmit={form.onSubmit(JoinOrg)}
          >
            <TextInput
              placeholder="Invite Code"
              size="md"
              required
              classNames={{
                input:
                  "focus:outline-none bg-[#ececec] border-gray-300 w-full focus:border-black rounded-lg w-full ",
              }}
              w="100%"
              //   variant="filled"

              radius="md"
              {...form.getInputProps("orgCode")}
            />
            <Button
              key="join-team"
              mt="xl"
              className="bg-blue-500  hover:bg-blue-400"
              type="submit"
              size="md"
              w="60%"
            >
              Join Team
            </Button>
          </form>

          <Text ta="center" mt="md">
            Don&apos;t have an invite code?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                setCreateOrg(true);
              }}
            >
              Create Your Own Team
            </span>
          </Text>
        </Paper>
      ) : (
        <Paper className={classes.form} p={30}>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Your team joining request is pending. Contact your admin to approve
            request to join the team.
          </Title>
          <div className="flex flex-col gap-8 md:flex-row justify-between items-center w-full max-w-[400px]">
            <Button
              key="change-join-code"
              mt="xl"
              className="border-blue-500 border-2 hover:bg-blue-400 hover:text-white"
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setHasJoined(false);
              }}
              w="100%"
            >
              Change the Join Code
            </Button>
            <Button
              key="create-team"
              mt="xl"
              className="bg-blue-500 text-wrap overflow-auto hover:bg-blue-400"
              type="button"
              onClick={() => {
                setCreateOrg(true);
              }}
              size="md"
              w="100%"
            >
              Create your Own Team
            </Button>
          </div>
        </Paper>
      )}
    </div>
  );
}

export default ProtectedRoute(ManageOrg);
