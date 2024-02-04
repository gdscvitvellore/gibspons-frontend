/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Group } from "@mantine/core";
import {
  IconLogout,
} from "@tabler/icons-react";
import { IoMdCalendar } from "react-icons/io";
import { BiSolidDashboard, BiBuildings } from "react-icons/bi";
import { RiTeamFill } from "react-icons/ri";
import { IoMailOpen } from "react-icons/io5";

import classes from "@/styles/NavbarSimple.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { authStore } from "@/store/auth";
import { useRouter } from "next/navigation";

const data = [
  { link: "", icon: BiSolidDashboard, label: "My Team"},
  { link: "", icon: RiTeamFill, label: "Members" },
  { link: "", icon: BiBuildings, label: "Sponsorships" },
  { link: "", icon: IoMdCalendar, label: "Event Details" },
  { link: "", icon: IoMailOpen, label: "Generate a Mail" }
];

function NavbarSimple() {
  const [active, setActive] = useState("My Team");
  const { logout } = authStore();
  const router = useRouter();

  const handleLogout = (e: React.BaseSyntheticEvent): void => {
    e.preventDefault();
    localStorage.clear();
    logout();
    router.push("/");
  };

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-end">
          <img src="./icon.svg" alt="Icon" className="h-[3.75rem]"/>
          <span className="flex flex-col text-white">
            <p className="text-3xl font-bold">gibspons</p>
            <p className="text-sm">by GDSC VIT.</p>
          </span>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(e) => handleLogout(e)}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

export default ProtectedRoute(NavbarSimple);
