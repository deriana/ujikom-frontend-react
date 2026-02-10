import React from "react";
import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TrashBinIcon,
  UserCircleIcon,
} from "../icons";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { RESOURCES } from "@/constants/Resource";
import { Database, Settings } from "lucide-react";

export type NavSubItem = {
  name: string;
  path: string;
  permission?: string;
  pro?: boolean;
  new?: boolean;
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  subItems?: NavSubItem[];
};

export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Attendances Report",
    icon: <Database />,
    path: "attendances/report",
    permission: buildPermission(RESOURCES.ATTENDANCE, PERMISSIONS.BASE.INDEX),
  },
  {
    name: "Master Data",
    icon: <PieChartIcon />,
    subItems: [
      {
        name: "Roles",
        path: "/roles",
        pro: false,
        permission: buildPermission(RESOURCES.ROLE, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Users",
        path: "/users",
        pro: false,
        permission: buildPermission(RESOURCES.USER, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Divisions",
        path: "/divisions",
        pro: false,
        permission: buildPermission(RESOURCES.DIVISION, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Allowances",
        path: "/allowances",
        pro: false,
        permission: buildPermission(RESOURCES.ALLOWANCE, PERMISSIONS.BASE.INDEX),
      },
      {
        name: "Positions",
        path: "/Positions",
        pro: false,
        permission: buildPermission(RESOURCES.POSITION, PERMISSIONS.BASE.INDEX),
      },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
];

export const othersItems: NavItem[] = [
  {
    icon: <TrashBinIcon />,
    name: "Trash",
    subItems: [
      // { name: "Trash", path: "/trash", pro: false },
      {
        name: "Divisions",
        path: "/trash/divisions",
        pro: false,
        permission: buildPermission(
          RESOURCES.DIVISION,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Allowances",
        path: "/trash/allowances",
        pro: false,
        permission: buildPermission(
          RESOURCES.ALLOWANCE,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Positions",
        path: "/trash/positions",
        pro: false,
        permission: buildPermission(
          RESOURCES.POSITION,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
      {
        name: "Users",
        path: "/trash/users",
        pro: false,
        permission: buildPermission(
          RESOURCES.USER,
          PERMISSIONS.BASE.RESTORE,
        ),
      },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
  {
    icon: <Settings />,
    name: "Settings",
    path: "/settings",
    permission: buildPermission(RESOURCES.SETTING, PERMISSIONS.BASE.INDEX),
  }
];
