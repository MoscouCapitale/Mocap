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
            name: "home",
            label: "Home",
            path: "/admin/pages",
            fpath: "/partials/admin/pages"
        }
    ];

    navItems.map((item) => route == item.path && (item.active = true));


  return (
    <div class="w-full min-h-screen p-10 flex-col justify-start items-start gap-[10px] inline-flex">
        <InpageNavbar items={navItems} />
        <Partial name="pages-content">
            <Component />
        </Partial>
    </div>
  );
}