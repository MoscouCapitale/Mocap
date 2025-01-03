import { IconChevronDown, IconChevronRight } from "@utils/icons.ts";

type InpageNavbarProps = {
  items: InpageNavbarItem[];
};

type InpageNavbarItem = {
  name: string;
  label: string;
  path: string;
  fpath?: string;
  active?: boolean;
};

export default function InpageNavbar(items: InpageNavbarProps) {
  return (
    <nav class="py-2.5 justify-start items-center gap-[50px] inline-flex mb-5">
      {items.items.map((item) => (
        <a
          class={`justify-start items-center gap-2.5 inline-flex ${
            item.active ? "text-text" : "text-text_grey"
          }`}
          href={item.path}
          f-partial={item.fpath}
        >
          {item.label}
          {item.active &&
            <IconChevronDown color="white" />}
          {!item.active &&
            <IconChevronRight color="grey" />}
        </a>
      ))}
    </nav>
  );
}
