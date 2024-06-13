"use client";
import cx from "clsx";
import { useEffect, useState } from "react";
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import classes from "../styles/headertabs.module.css";
import { authStore } from "../store/auth";
import { useRouter } from "next/navigation";
import { link, useLinkStore } from "../store/crumbs";
import { ToastContainer } from "react-toastify";

export default function HeaderTabs() {
  const [userMenuOpened] = useState(false);
  const [username, setuserName] = useState("");
  const { name, profile_pic } = authStore();
  const [items, setItems] = useState<link[]>();
  const router = useRouter();
  const { links, getLink } = useLinkStore();

  useEffect(() => {
    setuserName(name);
  }, [name]);

  useEffect(() => {
    const links = getLink();
    setItems(links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const crumbs = items?.map((item, index) => (
    <Anchor
      href={item.href}
      className=" hover:underline text-black rounded-full"
      key={index}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <div className={classes.header}>
      <ToastContainer />
      <Container className={classes.mainSection} size="full">
        <Breadcrumbs
          className="max-w-[55vw] md:max-w-[70vw] flex flex-wrap"
          separator=">"
        >
          {crumbs}
        </Breadcrumbs>
        <Group justify="end">
          <UnstyledButton
            onClick={() => {
              router.push("/profile");
            }}
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
            </Group>
          </UnstyledButton>

        </Group>
      </Container>
    </div>
  );
}
