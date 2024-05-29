import { DropdownItem } from "@models/App.ts";
import { useState } from "preact/hooks";
import { IconChevronDown } from "@utils/icons.ts";

type DropdownProps = {
  items: DropdownItem[];
  customLabel?: string;
  additionalItem?: DropdownItem;
  activeInDropdown?: boolean;
  multiSelect?: boolean;
};

export default function Dropdown({ items, customLabel, additionalItem, activeInDropdown, multiSelect }: DropdownProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const activeItem = items.find((item) => item.isActive);

  const renderedItems = activeInDropdown ? items : items.filter((item) => item !== activeItem);

  const mainLabel = () => {
    if (multiSelect) return "Select items";
    return customLabel || activeItem?.label || "Select an item";
  };

  return (
    <div className="inline-block text-left" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
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
          {mainLabel()}
          <IconChevronDown color="white" />
        </button>
      </div>

      {/* TODO: make this invisible, and make it appear when the button is clicked/hover in style, instead of in conditionnal rendering */}
      {showDropdown && (
        <div
          className="absolute bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-text z-50"
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
                  {multiSelect ? (
                    <div className="inline-flex items-center">
                      <input id={`dropdown_${item.id}`} type="checkbox" checked={item.isActive} />
                      <label htmlFor={`dropdown_${item.id}`} className="ml-2">
                        {item.label}
                      </label>
                    </div>
                  ) : (
                    item.label
                  )}
                </button>
              )
          )}
          {additionalItem && (
            <button
              onClick={additionalItem.onClick}
              className="inline-flex align-center justify-center w-full text-left px-4 py-2 text-sm text-text hover:bg-main/10"
              role="menuitem"
            >
              {additionalItem.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
