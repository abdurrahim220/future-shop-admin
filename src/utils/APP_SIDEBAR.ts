import {
  LayoutDashboardIcon,
  MapPinIcon,
  GitBranchIcon,
  BoxesIcon,
  TagIcon,
  MegaphoneIcon,
  LayersIcon,
  PackageIcon,
  TicketPercentIcon,
  BellIcon,
  ShoppingCartIcon,
  WalletIcon,
  StarIcon,
  StoreIcon,
  ArrowLeftRightIcon,
  TruckIcon,
  UsersIcon,
  SettingsIcon,
  LifeBuoyIcon,
  UserIcon,
  LogOutIcon,
  BookOpenIcon,
} from "lucide-react";

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: "Dashboard",
      url: "/dashboard",
      Icon: LayoutDashboardIcon,
    },
    {
      title: "Address",
      url: "/address",
      Icon: MapPinIcon,
    },
    {
      title: "Branches",
      url: "/branches",
      Icon: GitBranchIcon,
    },
    {
      title: "Branch Inventory",
      url: "/branchinventory",
      Icon: BoxesIcon,
    },
    {
      title: "Brands",
      url: "/brands",
      Icon: TagIcon,
    },
    {
      title: "Campaign",
      url: "/campaign",
      Icon: MegaphoneIcon,
    },
    {
      title: "Categories",
      url: "/categories",
      Icon: LayersIcon,
    },
    {
      title: "Combo Offers",
      url: "/combooffers",
      Icon: PackageIcon,
    },
    {
      title: "Coupons",
      url: "/cupons",
      Icon: TicketPercentIcon,
    },
    {
      title: "Notifications",
      url: "/notifications",
      Icon: BellIcon,
    },
    {
      title: "Orders",
      url: "/order",
      Icon: ShoppingCartIcon,
    },
    {
      title: "Sub Orders",
      url: "/suborder",
      Icon: ShoppingCartIcon,
    },
    {
      title: "Products",
      url: "/product",
      Icon: PackageIcon,
    },
    {
      title: "Reviews",
      url: "/reviews",
      Icon: StarIcon,
    },
    {
      title: "Seller",
      url: "/seller",
      Icon: StoreIcon,
    },
    {
      title: "Seller Wallet",
      url: "/sellerwallet",
      Icon: WalletIcon,
    },
    {
      title: "Stock Movement",
      url: "/stockmovement",
      Icon: ArrowLeftRightIcon,
    },
    {
      title: "Stock Transfer",
      url: "/stocktransfer",
      Icon: TruckIcon,
    },
    {
      title: "Users",
      url: "/user",
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
};

export const userMenu = {
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
};
