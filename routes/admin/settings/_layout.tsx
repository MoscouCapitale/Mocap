import { PageProps } from "$fresh/server.ts";
import InpageNavbar from "@components/Layout/InpageNavbar.tsx";

type InpageNavbarItem = {
    name: string;
    label: string;
    path: string;
    active?: boolean;
}

export default function Layout({ Component, state, route }: PageProps) {
    const navItems: InpageNavbarItem[] = [
        {
            name: "general",
            label: "Général",
            path: "/admin/settings"
        },
        {
            name: "users",
            label: "Utilisateur",
            path: "/admin/settings/user"
        },
        {
            name: "medias",
            label: "Médias",
            path: "/admin/settings/medias"
        },
        {
            name: "styles",
            label: "Styles",
            path: "/admin/settings/styles"
        },
        {
            name: "misc",
            label: "Autres",
            path: "/admin/settings/misc"
        },
    ];

    navItems.map((item) => route == item.path && (item.active = true));


  return (
    <>
        <InpageNavbar items={navItems} />
        <Component />
    </>
  );
}