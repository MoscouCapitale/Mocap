import { useState } from "preact/hooks";

import { NavItemType } from "@models/Layout.ts";
import { getAppStorage, saveAppStorage } from "@utils/localStorage.ts";
import LogoutButton from "@islands/Misc/LogoutButton.tsx";

import { IconChevronLeft, IconPhotoPlus, IconChartDonut, IconPencilStar, IconUsers, IconSettings2, IconMailbox } from "@utils/icons.ts";

//TODO: use Fresh Partials to render all admin pages
export default function Navbar(path: { path: string }) {
  const [collapsed, setCollapsed] = useState<boolean>(getAppStorage()?.navbarCollapsed || false);
  const navItems: NavItemType[] = [
    {
      name: "pages",
      path: "/admin/pages",
      label: "Pages",
      icon: IconPencilStar,
    },
    {
      name: "collection",
      path: "/admin/collection",
      label: "Collection",
      icon: IconPhotoPlus,
    },
    { name: "stats", path: "/admin/stats", label: "Stats", icon: IconChartDonut },
    {
      name: "users",
      path: "/admin/users",
      label: "Utilisateurs",
      icon: IconUsers,
    },
    {
      name: "settings",
      path: "/admin/settings",
      label: "Paramètres",
      icon: IconSettings2,
    },
    {
      name: "requests",
      path: "/admin/requests",
      label: "Demandes",
      icon: IconMailbox,
    },
  ];
  navItems.map((item) => path.path == item.path && (item.active = true));

  return (
    // TODO: fix nav, should be sticking in a fixed position if you scroll down
    <nav class="bg-black min-h-screen p-[30px] flex-col justify-between items-start inline-flex">
      <div class="flex-col justify-start items-start gap-10 inline-flex">
        {navItems.map((item) => {
          return (
            <a href={item.path} class="w-full justify-start items-center gap-5 inline-flex">
              <item.icon color={item.active ? "white" : "grey"} />
              {collapsed && <span class={`text-base ${item.active ? "text-text" : "text-text_grey"}`}>{item.label}</span>}
            </a>
          );
        })}
      </div>
      <div class="w-full items-start inline-flex flex-col gap-5">
        <LogoutButton />
        <a class="w-full justify-start items-center gap-5 inline-flex">
          <IconChevronLeft
            className={`hover:cursor-pointer ${!collapsed && "transform rotate-180"}`}
            color="white"
            onClick={() => {
              saveAppStorage({ navbarCollapsed: !collapsed });
              setCollapsed(!collapsed);
            }}
          />
          {collapsed && <span class={`text-base text-text`}>Fermer</span>}
        </a>
      </div>
    </nav>
  );
}
