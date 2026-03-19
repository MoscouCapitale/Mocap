import { baseInputStyle, FormFieldOptions, SelectField, SelectValue } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconChevronDown, IconX } from "@utils/icons.ts";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { Popover } from "react-tiny-popover";
import Chip from "./Chip.tsx";

/** Attribute shared across multiple Mocap object, used to compare two objects. Sorted by importance. */
const genericAttributes = ["id", "name", "title", "created"] as const;

const areOptionsEquals = (a?: FormFieldOptions, b?: FormFieldOptions) => {
  // const { value: valueA } = a ?? { value: 0 };
  // const { value: valueB } = b ?? { value: 0 };

  // if (!valueA && !valueB) return true;

  // if (typeof valueA !== typeof valueB) return false;

  // if (typeof valueA === "string" && typeof valueB === "string") return valueA === valueB;

  // type GenericObjects = { id?: number; name?: string };
  // const objA = valueA as GenericObjects;
  // const objB = valueB as GenericObjects;

  // return objA.id === objB.id || objA.name === objB.name;

  return getOptionUniqueValue(a) === getOptionUniqueValue(b);
};

const getOptionUniqueValue = (o?: FormFieldOptions) => {
  if (!o) return undefined;

  if (typeof o.value === "object") {
    const value = o.value as object;
    // ['id', 'name'].
    // if ('id' in o.value) return o.value.id;
    const attr = genericAttributes.find((attr) => attr in value);
    if (attr) return String(value[attr as keyof typeof value] ?? "");
    // Stringify the object and take the first 10 *cleaned* characters. Not ideal, but as fallback.
    else
      return JSON.stringify(value ?? {})
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10);
  } else {
    return o.value;
  }
};

export default function Select<M extends boolean = false>({
  field,
  onChange,
  error: defaultError,
}: {
  field: SelectField<M>;
  /** Main on change to bubble up the selected element */
  onChange: (value: SelectValue<M>) => void;
  error?: string;
}) {
  const isMultiple = field.multiple;
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [error, setError] = useState<string | undefined>(defaultError);
  const [selectedOptions, setSelectedOptions] = useState<SelectValue<M>>((field.defaultValue ?? (isMultiple ? [] : undefined)) as SelectValue<M>);
  const [options, setOptions] = useState<FormFieldOptions[]>();
  const maxElementShown = field.maxElementShown === undefined ? 3 : field.maxElementShown;

  /** Is the option selected. Because the reference can change, deep equal is not used, but only the selected attribute */
  const isSelected = (option: FormFieldOptions) =>
    isMultiple
      ? Boolean((selectedOptions as FormFieldOptions[]).find((s) => areOptionsEquals(s, option)))
      : areOptionsEquals(selectedOptions as FormFieldOptions, option);

  const fetchOptions = async () => {
    try {
      const res = await field.options(field);
      setOptions(res);

      // If options have changed, check that the selected options are still "available"
      if (Array.isArray(selectedOptions)) {
        setSelectedOptions(
          (options) => res.filter((o) => (options as FormFieldOptions[]).some((fetchedOption) => areOptionsEquals(o, fetchedOption))) as typeof options,
        );
      } else if (selectedOptions !== undefined) {
        setSelectedOptions((option) => res.find((fetchedOption) => areOptionsEquals(option as FormFieldOptions | undefined, fetchedOption)) as typeof option);
      }

      setError("");
    } catch (e) {
      console.error(`Error on select "${field.name}"`, e);
      setError("Error while retrieving options");
    }
  };

  field.updateOptions = fetchOptions;

  const clickMeButtonRef = useRef<HTMLButtonElement | null>(null);

  const selectItem = (value: FormFieldOptions | FormFieldOptions[] | undefined, fromOptions?: boolean) => {
    setSelectedOptions((p) => {
      if (value === undefined) {
        const cleared = (isMultiple ? [] : undefined) as SelectValue<M>;
        onChange(cleared);
        return cleared;
      }

      if (!isMultiple && Array.isArray(value)) return p;

      let v = value;
      if (fromOptions && options) {
        if (Array.isArray(value)) v = value.map((mappedValue) => options.find((o) => areOptionsEquals(o, mappedValue))).filter(Boolean) as typeof value;
        else v = options.find((o) => areOptionsEquals(o, value)) as typeof value;
      }

      if (isMultiple || Array.isArray(v)) {
        const updatedValue = [...([p as FormFieldOptions[]].flat().filter(Boolean) as FormFieldOptions[])];
        [v].flat().filter(Boolean).forEach((v) => {
          const index = updatedValue.findIndex((o) => areOptionsEquals(o, v));
          if (index === -1) updatedValue.push(v);
          else updatedValue.splice(index, 1);
        });
        onChange(updatedValue as SelectValue<M>);
        return updatedValue as SelectValue<M>;
      } else {
        onChange(v as SelectValue<M>);
        return v as SelectValue<M>;
      }
    });
  };

  field.selectOptions = (v) => selectItem(v, true);

  // TODO: use better styles
  const getSelectTriggerLabelling = useCallback(() => {
    const parsedOptions = [selectedOptions as FormFieldOptions[]].flat().filter(Boolean);
    const filteredOptions = parsedOptions.slice(0, maxElementShown);
    const restElementsLength = parsedOptions.length - filteredOptions.length;

    return [
      ...filteredOptions.map((v) => (
        <Chip key={`chip_${field.name}_${getOptionUniqueValue(v)}`} onDelete={isMultiple ? () => selectItem(v) : undefined}>
          {v.chipLabel ?? v.label}
        </Chip>
      )),
      restElementsLength > 0 && <Chip key={`chip_${field.name}_other`}>+{restElementsLength}</Chip>,
    ].filter(Boolean);
  }, [selectedOptions]);

  const hasSelectedItems = !![selectedOptions as FormFieldOptions[]].flat().filter(Boolean).length;

  const togglePopover = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!options) fetchOptions();
    setIsPopoverOpen((p) => !p);
  };

  return (
    <Popover
      key={field.name}
      isOpen={isPopoverOpen}
      positions={["bottom", "top", "left", "right"]}
      align="start"
      padding={10}
      onClickOutside={() => setIsPopoverOpen(false)}
      ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
      content={() => (
        <div className="min-w-37 flex flex-col p-1 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-background/20 border border-text z-50">
          {options?.map((option, index) => (
            <div
              key={`option_${getOptionUniqueValue(option)}_${index}`} // Not ideal, but we want to avoid using index as key, and the value can be non-unique. So we combine them.
              onClick={(e) => {
                // If onSelect return void (or does not exist), then select item
                if (option.onSelect?.(e, option) !== null) {
                  selectItem(option);
                  if (!isMultiple) setIsPopoverOpen(false);
                } else {
                  setIsPopoverOpen(false);
                }
              }}
              // Keep the menu open when click on item
              onSelect={(e: Event) => isMultiple && e.preventDefault()}
              onMouseEnter={(e) => option.onMouseEnter?.(e, option)}
              onMouseLeave={(e) => option.onMouseLeave?.(e, option)}
              className={cn(
                "inline-flex align-center justify-start px-4 py-2 text-sm text-text bg-black/0 select-none",
                "hover:outline-hidden",
                isSelected(option) ? "bg-text/10 hover:bg-black/20" : "bg-black/0 hover:bg-black/60",
              )}
            >
              <div className="relative max-w-75 flex gap-2 items-center grow truncate text-left">
                {/* TODO: find a better way to show the selected items with checks */}
                {/* {multiSelect &&
                            (
                                <div className="inline-flex w-4 items-center justify-center">
                                {isSelected(value) && <IconChecks className={"text-text opacity-80"} size={18} />}
                                </div>
                                )} */}
                {option.label}
              </div>
            </div>
          ))}
        </div>
      )}
    >
      <div
        className={cn(
          baseInputStyle,
          "min-w-37 max-w-full flex items-center gap-1 w-full",
          error && "border-error",
          field.label && "mt-2",
          error && !field.tooltipError && "mb-1",
          field.sx,
        )}
        onClick={(e) => !hasSelectedItems && togglePopover(e)}
      >
        <div className="flex grow min-w-0 gap-1 flex-wrap">{getSelectTriggerLabelling()}</div>
        {hasSelectedItems && (isMultiple || field.clearable) && (
          <button
            type="button"
            className=""
            aria-label="Delete selected"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isMultiple) {
                const value = [] as FormFieldOptions[] as SelectValue<M>;
                onChange(value);
                setSelectedOptions(value);
              } else {
                const value = undefined as SelectValue<M>;
                onChange(value);
                setSelectedOptions(value);
              }
            }}
          >
            <IconX className="hover:backdrop-brightness-150" />
          </button>
        )}
        <button type="button" className="" aria-label="Open options" onClick={togglePopover}>
          <IconChevronDown className="hover:backdrop-brightness-150" />
        </button>
      </div>
    </Popover>
  );
}
