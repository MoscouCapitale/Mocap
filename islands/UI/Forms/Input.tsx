import { baseInputStyle, FormField, FormFieldValue } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconInfoSquareRounded } from "@utils/icons.ts";
import { VNode } from "preact";
import { useState } from "preact/hooks";
import Select from "@islands/UI/Forms/Select.tsx";
import FileInput from "@islands/UI/Forms/FileInput/index.tsx";
import PreviewImage from "@islands/UI/Forms/FileInput/PreviewImage.tsx";
import RelationInput from "@islands/UI/Forms/RelationInput/index.tsx";

type InputFromTypeProps = {
  field: FormField;
  onChange: (value: FormFieldValue) => void;
  error: string | null;
};

const InputFromType = (
  { field, onChange, error }: InputFromTypeProps,
): VNode => {
  const defaultField = (
    <input
      className={cn(baseInputStyle, "border-text_grey")}
      placeholder={"Not implemented yet"}
      disabled
    />
  );

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
            baseInputStyle,
            error && "border-error",
            field.label && (field.type !== "checkbox") && "mt-2",
            error && !field.tooltipError && "mb-1",
          )}
          defaultValue={String(field.defaultValue ?? "")}
          type={field.type}
          placeholder={field.placeholder ?? ""}
          defaultChecked={field.type === "checkbox" ? Boolean(field.defaultValue) : undefined}
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
    case "select":
    case "multiselect":
      return (
        <Select
          field={field}
          error={error}
          onChange={onChange}
          multiSelect={field.type === "multiselect"}
          min={field.required ? 1 : 0}
          sx={"max-w-[200px]"}
        />
      );
    case "file":
      return (
        <FileInput
          // TODO: This way of bubbling up the click event is not ideal, I should find a better more elegant way
          overwriteOnFileZoneClick={() => {
            if (field.inputConfig?.onClickInput) {
              field.inputConfig?.onClickInput();
            }
          }}
          bgElement={field.defaultValue?.public_src
            ? (
              <PreviewImage
                src={field.defaultValue.public_src}
                filetype={field.defaultValue.type}
                filename={field.defaultValue.name}
              />
            )
            : undefined}
          label={field.inputConfig?.customLabel}
        />
      );
    case "relation":
      // Because the Select component always returns an array, we need to 'parse' the value to match the relation type (single or multiple)
      return <RelationInput field={field} onChange={(e) => onChange(field.relation?.multiple ? e : (e[0] ?? null))} />;
    case "NI":
    default:
      return defaultField;
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
    if (field.validation || field.required) {
      let error = field.validation ? field.validation(value) : null;
      if (field.required && !value) error = "Ce champ est requis";
      if (!error) {
        setFieldError(null);
        return onChange(value);
      }
      setFieldError(error);
    } else onChange(value);
  };

  return (
    <div>
      <label className={"flex flex-col w-full"}>
        {/* Set the style as inline for checkboxes */}
        {field.type === "checkbox"
          ? (
            <div className={"w-full flex items-center gap-2 justify-between"}>
              {field.label}
              <InputFromType
                field={field}
                onChange={onValueChange}
                error={fieldError}
              />
            </div>
          )
          : (
            <>
              {field.label}
              <InputFromType
                field={field}
                onChange={onValueChange}
                error={fieldError}
              />
            </>
          )}
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
