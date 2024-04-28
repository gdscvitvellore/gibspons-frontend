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
  rem,
  useMantineTheme,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import classes from "../styles/headertabs.module.css";
import { authStore } from "../store/auth";
import { useRouter } from "next/navigation";
import { link, useLinkStore } from "../store/crumbs";

export default function HeaderTabs() {
  const theme = useMantineTheme();
  // const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [username, setuserName] = useState("");
  const { name, logout, profile_pic } = authStore();
  const [items, setItems] = useState<link[]>();
  const router = useRouter();
  const {links, getLink} = useLinkStore();

  useEffect(() => {
    setuserName(name);
  }, [name]);

  useEffect(() => {
    const links = getLink();
    setItems(links);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const crumbs = items?.map((item, index) => (
    <Anchor href={item.href} className=" hover:underline text-black rounded-full" key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="full">
        <Breadcrumbs className="max-w-[55vw] md:max-w-[70vw] flex flex-wrap" separator=">">
          {crumbs}
        </Breadcrumbs>
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
                  <Avatar src={profile_pic} alt="profile pic" color="blue" />
                  <Text
                    fw={500}
                    className="hidden md:block max-w-[7rem] text-ellip"
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
