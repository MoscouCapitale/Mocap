import {
  baseInputStyle,
  FormField,
  FormFieldOptions,
  FormFieldValue,
} from "@models/Form.ts";
import { VNode } from "preact";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IconChevronDown, IconChevronRight } from "@utils/icons.ts";
import { cn } from "@utils/cn.ts";
import { useCallback, useEffect, useState } from "preact/compat";
import { effect } from "@preact/signals-core";

type SelectProps = {
  //   /** Make the options obligatory in the field */
  //   field: Partial<FormField> & {
  //     options: FormFieldOptions;
  //   };
  field: FormField;
  multiSelect?: boolean;
  /** Main on change to bubble up the selected element */
  onChange: (value: FormFieldValue) => void;
  /** Custom elements selected shown in the select field */
  customLabels?: (...els: string[]) => VNode; // TODO: handle custom labelling
  error: string | null;
  sx?: string;
};

export default function Select(
  { field, multiSelect, onChange, customLabels, error, sx }: SelectProps,
) {
  // TODO: set default value to string[]
  const [selected, setSelected] = useState<FormFieldOptions["value"][]>(
    field.defaultValue ? [field.defaultValue as string].flat() : [],
  );

  const isSelected = useCallback(
    (val: FormFieldOptions["value"]) => (selected ?? []).includes(val),
    [selected],
  );

  const getOptionFromValue = (value: FormFieldOptions["value"]) =>
    field.options?.find((o) => o.value === value);

  const selectItem = (val: FormFieldOptions["value"]) => {
    setSelected((p) => {
      const newVal = p.includes(val)
        ? p.filter((item) => item !== val)
        : [val, ...(multiSelect ? p : [])];
      // Bubble up the value, as single string if single select, array otherwise
      onChange(!multiSelect && newVal.length ? newVal[0] : newVal);
      return newVal;
    });
  };

  const getSelectTriggerLabelling = useCallback(() => {
    const defaultValue = field.placeholder ?? field.label ?? field.name;
    if (multiSelect) {
      // TODO: custom labelling
      return defaultValue;
    } else {
      return selected.length
        ? getOptionFromValue(selected[0])?.label ?? defaultValue
        : defaultValue;
    }
  }, [selected]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div
          className={cn(
            baseInputStyle,
            "min-w-[150px] flex items-center gap-1 w-fit",
            error && "border-error",
            field.label && "mt-2",
            error && !field.tooltipError && "mb-1",
            sx,
          )}
        >
          <p className={"grow max-w-[400px] truncate"}>
            {getSelectTriggerLabelling()}
          </p>
          <button
            className=""
            aria-label="Customise options"
          >
            <IconChevronDown />
          </button>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[150px] flex flex-col p-1 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-text z-50"
          sideOffset={5}
          align={"start"}
        >
          {field.options?.map((option) => (
            <DropdownMenu.Item
              key={option.label}
              onClick={() => selectItem(option.value)}
              // Keep the menu open when click on item
              onSelect={(e: Event) => multiSelect && e.preventDefault()}
              className={cn(
                "inline-flex align-center justify-start px-4 py-2 text-sm text-text bg-black bg-opacity-0 select-none",
                "hover:outline-none",
                isSelected(option.value)
                  ? "bg-text bg-opacity-10 hover:bg-opacity-20"
                  : "bg-black bg-opacity-0 hover:bg-opacity-60",
              )}
            >
              <p
                className={"max-w-[300px] truncate text-left "}
              >
                {option.label}
              </p>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
