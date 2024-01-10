import { useSignal } from "@preact/signals";

import { NavItemType } from "@models/Layout.ts";
import { getAppStorage, saveAppStorage } from "@utils/localStorage.ts";

import { ChevronLeft, Library, LineChart, Pencil, UserRoundCog, Wrench } from "lucide-icons";

export default function Navbar(path: { path: string }) {
  const collapsed = useSignal<boolean>(getAppStorage()?.navbarCollapsed || false);
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
  navItems.map((item) => path.path == item.path && (item.active = true));

  return (
    <nav class="bg-black min-h-screen p-[30px] flex-col justify-between items-start inline-flex">
      <div class="flex-col justify-start items-start gap-10 inline-flex">
        {navItems.map((item) => {
          return (
            <a href={item.path} class="w-full justify-start items-center gap-5 inline-flex">
              <item.icon color={item.active ? "white" : "grey"} />
              <span class={`text-base transition-all ${item.active ? "text-text" : "text-text_grey"} ${
                collapsed.value ? "hidden" : "block"
              }`}>{item.label}</span>
            </a>
          );
        })}
      </div>
      <div class="w-full justify-end items-center inline-flex">
        <ChevronLeft
          class={`hover:cursor-pointer transition-transform duration-300 ease-in-out ${collapsed.value ? "rotate-180" : "rotate-0"}`}
          color="white"
          onClick={() => {
            saveAppStorage({ navbarCollapsed: !collapsed.value });
            collapsed.value = !collapsed.value;
          }}
        />
      </div>
    </nav>
  );
}
