import { baseInputStyle, FormField, FormFieldOptions, FormFieldValue } from "@models/Form.ts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@utils/cn.ts";
import { IconChevronDown, IconX } from "@utils/icons.ts";
import { VNode } from "preact";
import { useCallback, useEffect, useState } from "preact/compat";

const getDefaultSelectValue = (field: FormField | SelectField, min: number) => {
  if (field.defaultValue) return [field.defaultValue as string].flat();
  if (min) return field.options?.slice(0, min).map((o) => o.value) as string[];
  return [];
};

interface CustomSelectOption extends FormFieldOptions {
  onMouseEnter?: (e: MouseEvent, id: number | string) => void;
  onMouseLeave?: (e: MouseEvent, id: number | string) => void;
}
[];

export interface SelectField extends FormField {
  options: CustomSelectOption[];
}

type SelectProps = {
  field: FormField | SelectField;
  multiSelect?: boolean;
  // defaultValues?: boolean;
  /** Main on change to bubble up the selected element */
  onChange: (value: FormFieldValue) => void;
  /** Custom elements selected shown in the select field */
  customLabels?: (elements: string[]) => VNode | string;
  min?: number;
  error: string | null;
  sx?: string;
  /** Allow to clear the current selection */
  clearable?: boolean;
  /** Name of the input, for form submission */
  inputName?: string; 
};

export default function Select(
  { field, multiSelect, onChange, customLabels, min = 0, error, sx, inputName }: SelectProps,
) {
  if (min && min > (field.options ?? []).length) {
    throw new Error(
      "The minimum value should be less than the number of options",
    );
  }

  const [selected, setSelected] = useState<FormFieldOptions["value"][]>(getDefaultSelectValue(field, min));

  // If available options are changed, reset the selection to avoid selected options not present anymore
  useEffect(() => setSelected(getDefaultSelectValue(field, min)), [field.options]);

  /** We need to create a state, because two dropdown on same level on the DOM have their Trigger interfering */
  const [open, setOpen] = useState<boolean>(false);

  const isSelected = useCallback(
    (val: FormFieldOptions["value"]) => (selected ?? []).includes(val),
    [selected],
  );

  const getOptionFromValue = (value: FormFieldOptions["value"]) => field.options?.find((o) => o.value === value);

  const selectItem = (val: FormFieldOptions["value"]) => {
    setSelected((p) => {
      const newVal = p.includes(val) ? p.filter((item) => item !== val) : [val, ...(multiSelect ? p : [])];
      // Bubble up the value, as single string if single select, array otherwise
      onChange(!multiSelect && newVal.length ? newVal[0] : newVal);
      return newVal;
    });
  };

  const getSelectTriggerLabelling = useCallback(() => {
    const defaultValue = field.placeholder ?? field.label ?? field.name;
    if (multiSelect) {
      if (customLabels) return customLabels(selected);
      return selected.length
        ? field.options?.filter(({ value: v }) => selected.includes(v)).map(({ label }) => label).join(", ") ??
          defaultValue
        : defaultValue;
    } else {
      return selected.length ? getOptionFromValue(selected[0])?.label ?? defaultValue : defaultValue;
    }
  }, [selected]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={(isOpen: boolean) => setOpen(isOpen)}>
      {inputName && !multiSelect && (
        <input
          type="hidden"
          name={inputName}
          value={selected.length ? selected[0] : ""}
        />
      )}
      <div
        className={cn(
          baseInputStyle,
          "min-w-[150px] flex items-center gap-1 w-fit",
          error && "border-error",
          field.label && "mt-2",
          error && !field.tooltipError && "mb-1",
          sx
        )}
      >
        <p className={"grow max-w-[400px] truncate"}>{getSelectTriggerLabelling()}</p>
        {min === 0 && selected.length > 0 && (
          <button
            className=""
            aria-label="Delete selected"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelected([]);
              onChange(null);
            }}
          >
            <IconX className={"hover:backdrop-brightness-150"} />
          </button>
        )}
        <DropdownMenu.Trigger asChild>
          <button className="" aria-label="Open options">
            <IconChevronDown className={"hover:backdrop-brightness-150"} />
          </button>
        </DropdownMenu.Trigger>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[150px] flex flex-col p-1 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-20 border border-text z-50"
          sideOffset={5}
          align={"start"}
        >
          {field.options?.map(({ value, label, ...rest }, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={(e: MouseEvent) => {
                selectItem(value);
                // If set, we need to trigger the onMouseLeave event because the dropdown will close, and the default event will not be triggered
                const onMouseLeave = (rest as CustomSelectOption).onMouseLeave;
                if (onMouseLeave) onMouseLeave(e, value);
              }}
              // Keep the menu open when click on item
              onSelect={(e: Event) => multiSelect && e.preventDefault()}
              onMouseEnter={(e: MouseEvent) => {
                const onMouseEnter = (rest as CustomSelectOption).onMouseEnter;
                if (onMouseEnter) onMouseEnter(e, value);
              }}
              onMouseLeave={(e: MouseEvent) => {
                const onMouseLeave = (rest as CustomSelectOption).onMouseLeave;
                if (onMouseLeave) onMouseLeave(e, value);
              }}
              className={cn(
                "inline-flex align-center justify-start px-4 py-2 text-sm text-text bg-black bg-opacity-0 select-none",
                "hover:outline-none",
                isSelected(value) ? "bg-text bg-opacity-10 hover:bg-opacity-20" : "bg-black bg-opacity-0 hover:bg-opacity-60"
              )}
            >
              <div className={"relative max-w-[300px] flex gap-2 items-center grow truncate text-left"}>
                {/* TODO: find a better way to show the selected items with checks */}
                {/* {multiSelect &&
                  (
                    <div className="inline-flex w-4 items-center justify-center">
                      {isSelected(value) && <IconChecks className={"text-text opacity-80"} size={18} />}
                    </div>
                  )} */}
                {label}
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
