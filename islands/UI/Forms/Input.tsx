import { FileInput, PreviewImage, RelationInput, Select } from "@islands/UI";
import { baseInputStyle, FormField, FormFieldValue, RelationFormField } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { IconEye, IconEyeClosed, IconInfoSquareRounded } from "@utils/icons.ts";
import { isEmpty } from "lodash";
import { VNode } from "preact";
import { useEffect, useState } from "preact/hooks";

type InputFromTypeProps = {
  field: FormField;
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

const InputFromType = ({ field, onChange, error, isControlled }: InputFromTypeProps): VNode => {
  const defaultField = <input name={field.name} value="" className={cn(baseInputStyle, "border-text_grey")} placeholder="Not implemented yet" disabled />;

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
            field.label && field.type !== "checkbox" && "mt-2",
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
          autoComplete={isControlled ? "off" : "on"} // Make sure the browser doesnt fill the controlled input
        />
      );
    case "select":
      return (
        <Select field={{ ...field, sx: field.sx + " w-full" }} error={error} onChange={(v) => onChange(Array.isArray(v) ? v.map((v) => v.value) : v?.value)} />
      );
    case "file":
      return (
        <FileInput
          // TODO: This way of bubbling up the click event is not ideal, I should find a better more elegant way
          overwriteOnFileZoneClick={field.inputConfig?.onClickInput ? field.inputConfig?.onClickInput : undefined}
          overwriteOnFileDeleteClick={field.inputConfig?.onClickInput ? () => onChange(null) : undefined}
          bgElement={
            field.defaultValue?.public_src ? (
              <PreviewImage
                src={field.defaultValue.public_src}
                filetype={field.defaultValue.type}
                filename={field.defaultValue.name}
                variant={field.inputConfig?.variant ?? "full-size"}
              />
            ) : undefined
          }
          label={field.inputConfig?.customLabel}
          filetype={field.inputConfig?.filetype}
          hasFile={Boolean(field.defaultValue)}
          variant={field.inputConfig?.variant}
          inputName={field.name}
        />
      );
    case "relation":
      // Because the Select component always returns an array, we need to 'parse' the value to match the relation type (single or multiple)
      return <RelationInput field={field} onChange={(e) => onChange(e)} />;
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
        ></textarea>
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

// TODO: Input should be part of a form system. This way I can manage validation, errors, state, etc.
export default function Input({ field, onChange }: InputProps) {
  const [fieldError, setFieldError] = useState<string>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateField = (newValue?: FormFieldValue): string | undefined => {
    const value = newValue ?? field.defaultValue;

    if (field.required) {
      switch (field.type) {
        case "string":
        case "email":
        case "password":
        case "markdown":
          if (value === "") return "Ce champ est requis";
          break;
        case "checkbox":
          if (value === undefined || value === null) return "Ce champ est requis";
          break;
        default:
          if (value === undefined || value === null || isEmpty(value)) {
            return "Ce champ est requis";
          }
      }
    }

    return field.validation?.(value) || undefined;
  };

  // On field mount, check errors that needs to be displayed
  useEffect(() => setFieldError(validateField()), [field.name]);

  const onValueChange = (value: FormFieldValue) => {
    const error = validateField(value);
    setFieldError(error);
    onChange?.(value);
  };

  return (
    <div className="flex flex-col w-full" onClick={(e) => field.type !== "checkbox" && e.preventDefault()}>
      {/* Set the style as inline for checkboxes */}
      {field.type === "checkbox" && (
        <div className="w-full flex items-center gap-2 justify-between">
          <label className="text-text">{field.label}</label>
          <InputFromType field={field} onChange={onValueChange} error={fieldError} isControlled={!!onChange} />
        </div>
      )}
      {field.type === "password" && (
        <>
          <label className="text-text">{field.label}</label>
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
        <>
          <label className="text-text">{field.label}</label>
          <InputFromType field={field} onChange={onValueChange} error={fieldError} isControlled={!!onChange} />
        </>
      )}
      {fieldError && !field.tooltipError && (
        <div className={cn("flex justify-start items-center gap-2")}>
          <IconInfoSquareRounded color="#EA5959" size={14} />
          <p className="text-error text-xs">{fieldError}</p>
        </div>
      )}
    </div>
  );
}
