"use client";
import cx from "clsx";
import { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import classes from "../styles/headertabs.module.css";
import { authStore } from "../store/auth";
import { useRouter } from "next/navigation";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

const tabs = [
  "Home",
  "Orders",
  "Education",
  "Community",
  "Forums",
  "Support",
  "Account",
  "Helpdesk",
];

export default function HeaderTabs() {
  const theme = useMantineTheme();
  // const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [username, setuserName] = useState("");
  const { name, logout } = authStore();
  const router = useRouter();

  useEffect(() => {
    setuserName(name);
  }, [name]);

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="full">
        <Group justify="end">
          {/* <MantineLogo size={28} /> */}

          {/* <Burger opened={opened} onClick={() => {
            toggle()
            setUserMenuOpened(true)
          }}  hiddenFrom="lg" size="sm" /> */}

          <Menu
            width={160}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  <Avatar
                    src={user.image}
                    alt={username}
                    radius="xl"
                    size={20}
                  />
                  <Text
                    fw={500}
                    className="hidden md:block"
                    size="sm"
                    lh={1}
                    mr={3}
                  >
                    {username}
                  </Text>
                  {/* <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} /> */}
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component="button"
                onClick={() => {
                  router.push("/profile");
                }}
                leftSection={
                  <IconUser
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                }
              >
                Your Profile
              </Menu.Item>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconSettings
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Account settings
              </Menu.Item>
              <Menu.Item
                component="button"
                onClick={() => {
                  // localStorage.clear();
                  router.push("/");
                  logout();
                }}
                leftSection={
                  <IconLogout
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      {/* <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container> */}
    </div>
  );
}
