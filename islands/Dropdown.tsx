import { DropdownItem } from "@models/App.ts";
import { useState } from "preact/hooks";
import { IconChevronDown } from "@utils/icons.ts";

type DropdownProps = {
  items: DropdownItem[];
  customLabel?: string;
  additionalItem?: DropdownItem;
  activeInDropdown?: boolean;
};

export default function Dropdown({ items, customLabel, additionalItem, activeInDropdown }: DropdownProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const activeItem = items.find((item) => item.isActive);

  const renderedItems = activeInDropdown ? [...items, additionalItem] : [...items.filter((item) => item !== activeItem), additionalItem];

  return items?.length > 0 && activeItem ? (
    <div
      className="relative inline-block text-left" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="pb-[10px]">
        {/* bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0 */}
        <button
          type="button"
          className="bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {customLabel || activeItem.label}
          <IconChevronDown color="white" />
        </button>
      </div>

      {/* TODO: make this invisible, and make it appear when the button is clicked/hover in style, instead of in conditionnal rendering */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 min-w-full bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-text z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {renderedItems.map(
            (item) =>
              item && (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="inline-flex align-center justify-center w-full text-left px-4 py-2 text-sm text-text hover:bg-main/10"
                  role="menuitem"
                >
                  {item.label}
                </button>
              )
          )}
        </div>
      )}
    </div>
  ) : null;
}
