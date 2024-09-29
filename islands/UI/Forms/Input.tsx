import { FormField, FormFieldValue } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconInfoSquareRounded } from "@utils/icons.ts";
import { VNode } from "preact";
import { useState } from "preact/hooks";

type InputFromTypeProps = {
  field: FormField;
  onChange: (value: FormFieldValue) => void;
  error: string | null;
};

const InputFromType = (
  { field, onChange, error }: InputFromTypeProps,
): VNode => {
  switch (field.type) {
    case "string":
    case "number":
    case "checkbox":
    case "date":
    case "color":
    case "email":
    case "password":
      return (
        <input
          className={cn(
            "min-w-[200px] bg-background text-[15px] rounded px-[5px] py-[3px] border-2 border-text text-text focus:border-main focus:outline-none focus:ring-0 mx-0",
            error && "border-error",
            field.label && "mt-2",
            error && !field.tooltipError && "mb-1",
          )}
          defaultValue={String(field.defaultValue ?? "")}
          type={field.type}
          placeholder={field.placeholder ?? ""}
          defaultChecked={field.type === "checkbox"
            ? Boolean(field.defaultValue)
            : undefined}
          onChange={(e) => {
            switch (field.type) {
              case "number":
                return onChange(Number(e.currentTarget.value));
              case "checkbox":
                return onChange(e.currentTarget.checked);
              case "date":
                return onChange(new Date(e.currentTarget.value));
              default:
                return onChange(e.currentTarget.value);
            }
          }}
          required={field.required}
          readOnly={field.readOnly}
          disabled={field.disabled}
          title={error && field.tooltipError ? error : undefined}
        />
      );
    case "file":
    case "select":
    case "multiselect":
    default:
      return <p>Not supported</p>;
  }
};

type InputProps = {
  field: FormField;
  onChange: (value: FormFieldValue) => void;
};

export default function Input({ field: initialField, onChange }: InputProps) {
  const [field, setField] = useState<FormField>(initialField);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const onValueChange = (value: FormFieldValue) => {
    if (field.validation) {
      const error = field.validation(value);
      if (!error) {
        setFieldError(null);
        return onChange(value);
      }
      setFieldError(error);
    } else onChange(value);
  };

  return (
    <div>
      <label className={"flex flex-col"}>
        {field.label}
        <InputFromType
          field={field}
          onChange={onValueChange}
          error={fieldError}
        />
        {fieldError && !field.tooltipError &&
          (
            <div
              className={cn(
                "flex justify-start items-center gap-2",
              )}
            >
              <IconInfoSquareRounded color="#EA5959" size={14} />
              <p className={"text-error text-xs"}>{fieldError}</p>
            </div>
          )}
      </label>
    </div>
  );
}
