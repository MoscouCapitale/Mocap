import { useSignal } from "@preact/signals";

import { NavItemType } from "@models/Layout.ts";
import NavbarItem from "@components/Layout/NavbarItem.tsx";
import { getAppStorage, saveAppStorage } from "@utils/localStorage.ts";

import {
  ChevronLeft,
  Library,
  LineChart,
  Pencil,
  UserRoundCog,
  Wrench,
} from "lucide-icons";

//TODO: use Fresh Partials to render all admin pages
export default function Navbar(path: { path: string }) {
  const collapsed = useSignal<boolean>(false);
  const navItems: NavItemType[] = [
    {
      name: "pages",
      path: "/admin/pages",
      label: "Pages",
      icon: Pencil,
    },
    {
      name: "collection",
      path: "/admin/collection",
      label: "Collection",
      icon: Library,
    },
    { name: "stats", path: "/admin/stats", label: "Stats", icon: LineChart },
    {
      name: "users",
      path: "/admin/users",
      label: "Utilisateurs",
      icon: UserRoundCog,
    },
    {
      name: "settings",
      path: "/admin/settings",
      label: "Paramètres",
      icon: Wrench,
    },
  ];
  console.log("===== Collapsed ", collapsed.value);
  navItems.map((item) => path.path == item.path && (item.active = true));

  return (
    <nav class="bg-black min-h-screen p-[30px] flex-col justify-between items-start inline-flex">
      <div class="flex-col justify-start items-start gap-10 inline-flex">
        {navItems.map((item) => <NavbarItem {...item} collapsed={collapsed.value} />)}
      </div>
      <div class="w-full justify-end items-center inline-flex">
        <ChevronLeft
          class="hover:cursor-pointer"
          color="white"
          onClick={() => 
            {saveAppStorage({ navbarCollapsed: !collapsed.value })
            collapsed.value = !collapsed.value}
          }
        />
      </div>
    </nav>
  );
}
