import { PageProps } from "$fresh/server.ts";
import InpageNavbar from "@components/Layout/InpageNavbar.tsx";
import { Partial } from "$fresh/runtime.ts";

type InpageNavbarItem = {
    name: string;
    label: string;
    path: string;
    fpath?: string;
    active?: boolean;
}

export default function Layout({ Component, state, route }: PageProps) {
    const navItems: InpageNavbarItem[] = [
        {
            name: "medias",
            label: "Médias",
            path: "/admin/collection",
            fpath: "/partials/admin/collection"
        },
        {
            name: "bricks",
            label: "Briques",
            path: "/admin/collection/bricks",
            fpath: "/partials/admin/collection/bricks"
        }
    ];

    navItems.map((item) => route == item.path && (item.active = true));


  return (
    <>
        <InpageNavbar items={navItems} />
        <Partial name="collection-content">
            <Component />
        </Partial>
    </>
  );
}