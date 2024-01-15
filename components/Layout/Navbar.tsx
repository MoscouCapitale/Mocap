import { useSignal } from "@preact/signals";

import { NavItemType } from "@models/Layout.ts";
import NavbarItem from "@components/Layout/NavbarItem.tsx";
import { getAppStorage, saveAppStorage } from "@utils/localStorage.ts";

import { IconChevronLeft, IconPhotoPlus, IconChartDonut, IconPencilStar, IconUsers, IconSettings2, IconMailbox } from "@utils/icons.ts";

//TODO: use Fresh Partials to render all admin pages
export default function Navbar(path: { path: string }) {
  const collapsed = useSignal<boolean>(false);
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
    <nav class="bg-black min-h-screen p-[30px] flex-col justify-between items-start inline-flex">
      <div class="flex-col justify-start items-start gap-10 inline-flex">
        {navItems.map((item) => (
          <NavbarItem {...item} collapsed={collapsed.value} />
        ))}
      </div>
      <div class="w-full justify-end items-center inline-flex">
        <IconChevronLeft
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
