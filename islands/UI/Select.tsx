import { baseInputStyle, FormFieldOptions, SelectField, SelectValue } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconChevronDown, IconX } from "@utils/icons.ts";
import { useCallback, useRef, useState } from "preact/hooks";
import { Popover } from "react-tiny-popover";
import Chip from "./Chip.tsx";

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

  const isSelected = (option: FormFieldOptions) =>
    isMultiple ? (selectedOptions as FormFieldOptions[]).indexOf(option) >= 0 : (selectedOptions as FormFieldOptions) === option;

  const fetchOptions = async () => {
    try {
      const res = await field.options(field);
      setOptions(res);

      setError("");
    } catch (e) {
      console.error(`Error on select "${field.name}"`, e);
      setError("Error while retrieving options");
    }
  };

  const clickMeButtonRef = useRef<HTMLButtonElement | null>(null);

  const selectItem = (v: FormFieldOptions) => {
    setSelectedOptions((p) => {
      if (isMultiple) {
        const updatedValue = [...(p as FormFieldOptions[])];
        const index = updatedValue.indexOf(v);
        if (index === -1) updatedValue.push(v);
        else updatedValue.splice(index, 1);
        onChange(updatedValue as SelectValue<M>);
        return updatedValue as SelectValue<M>;
      } else {
        onChange(v as SelectValue<M>);
        return v as SelectValue<M>;
      }
    });
  };

  // TODO: use better styles
  const getSelectTriggerLabelling = useCallback(() => {
    const parsedOptions = [selectedOptions as FormFieldOptions[]].flat().filter(Boolean);
    const filteredOptions = parsedOptions.slice(0, maxElementShown);
    const restElementsLength = parsedOptions.length - filteredOptions.length;

    return [
      ...filteredOptions.map((v) => (
        <Chip key={`chip_${field.name}_${v.value}`} onDelete={isMultiple ? () => selectItem(v) : undefined}>
          {v.chipLabel ?? v.label}
        </Chip>
      )),
      restElementsLength > 0 && <Chip key={`chip_${field.name}_other`}>+{restElementsLength}</Chip>,
    ];
  }, [selectedOptions]);

  const hasSelectedItems = !![selectedOptions as FormFieldOptions[]].flat().filter(Boolean).length;

  return (
    <Popover
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
              key={index}
              onClick={(e) => {
                selectItem(option);
                if (!isMultiple) setIsPopoverOpen(false);
                option.onSelect?.(e, option);
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
          "min-w-37 max-w-full flex items-center gap-1 w-fit",
          error && "border-error",
          field.label && "mt-2",
          error && !field.tooltipError && "mb-1",
          field.sx,
        )}
      >
        <div className="flex grow gap-1 overflow-hidden">{getSelectTriggerLabelling()}</div>
        {hasSelectedItems && isMultiple && (
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
        <button
          type="button"
          className=""
          aria-label="Open options"
          onClick={() => {
            if (!options) fetchOptions();
            setIsPopoverOpen(true);
          }}
        >
          <IconChevronDown className="hover:backdrop-brightness-150" />
        </button>
      </div>
    </Popover>
  );
}
