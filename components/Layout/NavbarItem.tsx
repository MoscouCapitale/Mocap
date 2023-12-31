import { NavItemType } from "@models/Layout.ts";

export default function NavbarItem(
  { name, path, label, icon: Icon, active }: NavItemType,
  collapsed: boolean,
) {
  // console.log("NavbarItem, ", collapsed);
  return (
    <a href={path} class="w-full justify-start items-center gap-5 inline-flex">
      <Icon color={active ? "white" : "grey"} />
      {collapsed &&
        (
          <span class={`text-base ${active ? "text-text" : "text-text_grey"}`}>
            {label}
          </span>
        )}
    </a>
  );
}
