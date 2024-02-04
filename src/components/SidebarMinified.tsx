import { useState } from "react";
import { Center, Tooltip, UnstyledButton, Stack, rem } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { BiSolidDashboard, BiBuildings } from "react-icons/bi";
import { RiTeamFill } from "react-icons/ri";
import { IoMailOpen } from "react-icons/io5";
import { IoMdCalendar } from "react-icons/io";
import Image from "next/image";
import classes from "../styles/sidebarminified.module.css";

interface NavbarLinkProps {
  icon: typeof BiSolidDashboard;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} fontWeight={600} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: BiSolidDashboard, label: "My Team" },
  { icon: RiTeamFill, label: "Members" },
  { icon: BiBuildings, label: "Sponsorships" },
  { icon: IoMdCalendar, label: "Event Details" },
  { icon: IoMailOpen, label: "Generate a Mail" },
];

export default function NavbarMinimal() {
  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
      icon={link.icon}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Image
          src="./icon.svg"
          alt="Gibspons"
          height="50"
          width="50"
          className="h-[50px]"
        />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" /> */}
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
