import { BookOpenIcon, ChartPieIcon, CopyCheckIcon, FolderKanbanIcon, HomeIcon, LayoutDashboardIcon, LifeBuoyIcon, LogOutIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react";

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: "Home",
      url: "/",
      Icon: HomeIcon,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      Icon: LayoutDashboardIcon,
    },
    {
      title: "Project",
      url: "/project",
      Icon: FolderKanbanIcon,
    },
    {
      title: "Tasks",
      url: "/tasks",
      Icon: CopyCheckIcon,
    },
    {
      title: "Reporting",
      url: "/reporting",
      Icon: ChartPieIcon,
    },
    {
      title: "Users",
      url: "/users",
      Icon: UsersIcon,
    },
  ],
  secondaryNav: [
    {
      title: "Support",
      url: "/support",
      Icon: LifeBuoyIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      Icon: SettingsIcon,
    },
  ],
  userMenu: {
    itemsPrimary: [
      {
        title: "View profile",
        url: "/profile",
        Icon: UserIcon,
        kbd: "⌘K->P",
      },
      {
        title: "Account settings",
        url: "/settings",
        Icon: SettingsIcon,
        kbd: "⌘S",
      },
      {
        title: "Documentation",
        url: "#",
        Icon: BookOpenIcon,
      },
    ],
    itemsSecondary: [
      {
        title: "Sign out",
        url: "/logout",
        Icon: LogOutIcon,
        kbd: "⌥⇧Q",
      },
    ],
  },
};