import { useEffect, useState } from "preact/hooks";

import { NavItemType } from "@models/Layout.ts";
import { getAppStorage, saveAppStorage } from "@utils/localStorage.ts";
import LogoutButton from "@islands/Misc/LogoutButton.tsx";

import {
  IconChartDonut,
  IconChevronLeft,
  IconMailbox,
  IconPencilStar,
  IconPhotoPlus,
  IconSettings2,
  IconUsers
} from "@utils/icons.ts";

//TODO: use Fresh Partials to render all admin pages
export default function Navbar(path: { path: string }) {
  const [collapsed, setCollapsed] = useState<boolean>(
    getAppStorage()?.navbarCollapsed || false,
  );

  const [readyToRender, setReadyToRender] = useState(false);

  const [navItems, setNavItems] = useState<NavItemType[]>([
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
    {
      name: "stats",
      path: "/admin/stats",
      label: "Stats",
      icon: IconChartDonut,
    },
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
  ]);

  useEffect(() => {
    async function init() {
      setNavItems((prev) =>
        prev.map((item) =>
          path.path == item.path
            ? { ...item, active: true }
            : { ...item, active: false }
        )
      );
      let requestNb = 0;
      const res = await fetch("/api/request/getNotifications");
      if (res.ok && res.status !== 204) requestNb = await res.json();
      if (requestNb) {
        setNavItems((prev) =>
          prev.map((item) =>
            item.name == "requests"
              ? { ...item, badge: { count: requestNb, color: "error" } }
              : item
          )
        );
      }
    }

    init().then(() => setReadyToRender(true));
  }, []);

  return (
    // TODO: fix nav, should be sticking in a fixed position if you scroll down
    <nav class="bg-black min-h-screen p-[30px] flex-col justify-between items-start inline-flex">
      <div class="flex-col justify-start items-start gap-10 inline-flex">
        {readyToRender && navItems.map((item) => NavbarItem(item, collapsed))}
      </div>
      <div class="w-full items-start inline-flex flex-col gap-5">
        <LogoutButton />
        <a class="w-full justify-start items-center gap-5 inline-flex">
          <IconChevronLeft
            className={`hover:cursor-pointer ${
              !collapsed && "transform rotate-180"
            }`}
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

function NavbarItem(item: NavItemType, collapsed: boolean) {
  return (
    <a
      href={item.path}
      class="w-full justify-start items-center gap-5 inline-flex relative"
    >
      {item.icon  && <item.icon color={item.active ? "white" : "grey"} className={`${item.badge && "z-20"}`} />}
      {collapsed && (
        <span
          class={`text-base ${item.active ? "text-text" : "text-text_grey"}`}
        >
          {item.label}
        </span>
      )}
      {item.badge && (
        <span
          class={`absolute bg-${item.badge.color} rounded-full text-white text-xs w-[20px] h-[20px] flex justify-center items-center top-[-7px] right-[-7px] z-10`}
        >
          {item.badge.count}
        </span>
      )}
    </a>
  );
}
