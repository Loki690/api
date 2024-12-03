import {
  ArchiveBoxIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { GearIcon } from "@radix-ui/react-icons";
import { HandHelping, SquareLibrary } from "lucide-react";

export const navigation = [
  {
    id: "0",
    title: "Home",
    url: "/",
  },
  {
    id: "1",
    title: "Abouts",
    url: "/abouts",
  },
  {
    id: "2",
    title: "Features",
    url: "/feature",
  },

  {
    id: "3",
    title: "Github",
    url: "/github",
    onlyMobile: true,
  },
  {
    id: "4",
    title: "Projects",
    url: "/projects",
    onlyMobile: true,
  },
];

export const sidenav = [
  // {
  //   id: "6",
  //   icons: <Squares2X2Icon className="size-4" />,
  //   title: "Dashboard",
  //   path: "/dashboard/:projectId",
  // },
  {
    id: "6",
    icons: <ArchiveBoxIcon className="size-4" />,
    title: "Item-List",
    path: "/admin/items/:projectId",
  },
  {
    id: "7",
    icons: <ArchiveBoxIcon className="size-4" />,
    title: "Items",
    path: "/items/:projectId",
  },
  {
    id: "8",
    icons: <PresentationChartLineIcon className="size-4" />,
    title: "Receiving",
    path: "/receiving/:projectId",
  },
  {
    id: "9",
    icons: <HandHelping className="size-4" />,
    title: "Issuing",
    path: "/issuing/:projectId",
  },
  {
    id: "10",
    icons: <UserGroupIcon className="size-4" />,
    title: "Users",
    path: "/users",
  },
  {
    id: "11",
    icons: <SquareLibrary className="size-4" />,
    title: "Projects",
    path: "/projects",
  },
  {
    id: "12",
    icons: <GearIcon className="size-4" />,
    title: "Options",
    path: "/options/:projectId",
  },
];

export const dropdownlist = [
  {
    id: "10",
    title: "Dasboard",
    tab: "userdash",
  },
  {
    id: "11",
    title: "Profile",
    tab: "profile",
  },
];
