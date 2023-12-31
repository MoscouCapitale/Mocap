import { useSignal } from "@preact/signals";

import { ChevronDown, ChevronRight } from "lucide-icons";

type InpageNavbarProps = {
  items: InpageNavbarItem[];
};

type InpageNavbarItem = {
  name: string;
  label: string;
  path: string;
  active?: boolean;
};

export default function InpageNavbar(items: InpageNavbarProps) {
  return (
    <nav class="py-2.5 justify-start items-center gap-[50px] inline-flex">
      {items.items.map((item) => (
        <a
          class={`justify-start items-center gap-2.5 inline-flex ${
            item.active ? "text-text" : "text-text_grey"
          }`}
          href={item.path}
        >
          {item.label}
          {item.active &&
            <ChevronDown color="white" />}
          {!item.active &&
            <ChevronRight color="grey" />}
        </a>
      ))}
    </nav>
  );
}
