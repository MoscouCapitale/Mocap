import { FileInput, PreviewImage, RelationInput, Select } from "@islands/UI";
import { baseInputStyle, FormField, FormFieldValue, SelectField } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconEye, IconEyeClosed, IconInfoSquareRounded } from "@utils/icons.ts";
import { isEmpty } from "lodash";
import { VNode } from "preact";
import { useEffect, useState } from "preact/hooks";

type InputFromTypeProps = {
  field: FormField | SelectField;
  onChange: (value: FormFieldValue) => void;
  /** This attribute is used when rendering this input on SSR.
   *
   * For some reason, on SSR, the defaultValue will not be set, resulting in the input
   * containing the correct value, but being visually empty. To know if the input is controlled
   * or not, we use the `onChange` prop to determine it.
   * TODO: Open an issue on Fresh to track down this bug
  */
 isControlled: boolean;
 error?: string;
};

const InputFromType = (
  { field, onChange, error, isControlled }: InputFromTypeProps,
): VNode => {
  const defaultField = (
    <input
      name={field.name}
      value=""
      className={cn(baseInputStyle, "border-text_grey")}
      placeholder="Not implemented yet"
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
            ...(field.type === "checkbox" ? ["min-w-auto", "ml-0"] : []),
            error && "border-error",
            field.label && (field.type !== "checkbox") && "mt-2",
            error && !field.tooltipError && "mb-1",
            field.sx,
          )}
          defaultValue={String(field.defaultValue ?? "")}
          {...(!isControlled ? { value: String(field.defaultValue ?? "") } : {})}
          type={field.type}
          placeholder={field.placeholder ?? ""}
          defaultChecked={field.type === "checkbox" ? field.defaultValue : undefined}
          {...(field.type === "checkbox" && !isControlled ? { checked: field.defaultValue } : {})}
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
          name={field.name}
          required={field.required}
          readOnly={field.readOnly}
          disabled={field.disabled}
          title={error && field.tooltipError ? error : undefined}
          autoComplete="on"
        />
      );
    case "select":
      return (
        <Select
          field={{ ...field, sx: field.sx + " w-full"} as SelectField}
          error={error}
          onChange={onChange}
        />
      );
    case "file":
      return (
        <FileInput
          // TODO: This way of bubbling up the click event is not ideal, I should find a better more elegant way
          overwriteOnFileZoneClick={field.inputConfig?.onClickInput ? field.inputConfig?.onClickInput : undefined}
          overwriteOnFileDeleteClick={field.inputConfig?.onClickInput ? () => onChange(null) : undefined}
          bgElement={field.defaultValue?.public_src
            ? (
              <PreviewImage
                src={field.defaultValue.public_src}
                filetype={field.defaultValue.type}
                filename={field.defaultValue.name}
                variant={field.inputConfig?.variant ?? "full-size"}
              />
            )
            : undefined}
          label={field.inputConfig?.customLabel}
          filetype={field.inputConfig?.filetype}
          hasFile={Boolean(field.defaultValue)}
          variant={field.inputConfig?.variant}
          inputName={field.name}
        />
      );
    case "relation":
      // Because the Select component always returns an array, we need to 'parse' the value to match the relation type (single or multiple)
      return <RelationInput field={field} onChange={(e) => onChange(field.relation?.multiple ? e : (e[0] ?? null))} />;
    case "markdown":
      // For now, markdown will just be a textarea (I do not think a markdown input is really needed)
      return (
        <textarea
          className={cn(
            baseInputStyle,
            error && "border-error",
            field.label && "mt-2",
            error && !field.tooltipError && "mb-1",
            field.type === "markdown" && "h-40",
            field.sx,
          )}
          defaultValue={String(field.defaultValue ?? "")}
          placeholder={field.placeholder ?? ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          name={field.name}
          required={field.required}
          readOnly={field.readOnly}
          disabled={field.disabled}
          title={error && field.tooltipError ? error : undefined}
          autoComplete="on"
        >
        </textarea>
      );
    case "NI":
    default:
      return defaultField;
  }
};

type InputProps = {
  field: FormField;
  onChange?: (value: FormFieldValue) => void;
};

export default function Input({ field, onChange }: InputProps) {
  const [fieldError, setFieldError] = useState<string>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // On field mount, check errors that needs to be displayed
  useEffect(() => {
    if (field.relation && (field.validation || field.required)) {
      let error = field.validation?.(field.defaultValue) ?? undefined;
      if (field.required && (!field.defaultValue || isEmpty(field.defaultValue))) error = "Ce champ est requis";
      setFieldError(error);
    }
  }, [field.name]);

  const onValueChange = (value: FormFieldValue) => {
    if (field.validation || field.required) {
      let error = field.validation?.(field.defaultValue) ?? undefined;
      if (field.required && (!value || isEmpty(value))) error = "Ce champ est requis";
      if (!error) {
        setFieldError(undefined);
        return onChange ? onChange(value) : null;
      }
      setFieldError(error);
      if (onChange) onChange(null);
    } else {
      if (onChange) onChange(value);
    }
  };

  return (
    <>
      <label className="flex flex-col w-full">
        {/* Set the style as inline for checkboxes */}
        {field.type === "checkbox" &&
          (
            <div className="w-full flex items-center gap-2 justify-between">
              {field.label}
              <InputFromType
                field={field}
                onChange={onValueChange}
                error={fieldError}
                isControlled={!!onChange}
              />
            </div>
          )}
        {field.type === "password" && (
          <>
            {field.label}
            <div className="w-full relative">
              <InputFromType
                field={{ ...field, type: isPasswordVisible ? "string" : field.type }}
                onChange={onValueChange}
                error={fieldError}
                isControlled={!!onChange}
              />
              <div
                className={cn("absolute top-0 bottom-0 right-0 -translate-x-2 flex items-center gap-2 cursor-pointer")}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? <IconEye color="#FFF" /> : <IconEyeClosed color="#FFF" />}
              </div>
            </div>
          </>
        )}
        {field.type !== "checkbox" && field.type !== "password" && (
          (
            <>
              {field.label}
              <InputFromType
                field={field}
                onChange={onValueChange}
                error={fieldError}
                isControlled={!!onChange}
              />
            </>
          )
        )}
        {fieldError && !field.tooltipError &&
          (
            <div
              className={cn(
                "flex justify-start items-center gap-2",
              )}
            >
              <IconInfoSquareRounded color="#EA5959" size={14} />
              <p className="text-error text-xs">{fieldError}</p>
            </div>
          )}
      </label>
    </>
  );
}
