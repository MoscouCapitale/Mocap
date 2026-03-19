import { cn } from "@utils/cn.ts";
import { ComponentChildren } from "preact";
import { JSX } from "preact/jsx-runtime";
import { Paths } from "./App.ts";
import { ETableNames } from "./forms/bricks.tsx";
import { Media } from "./Medias.ts";

export type InputError = {
  error: boolean;
  field: string;
  message: string;
};

// TODO: Support for all of these fields
export interface BaseFormField {
  /** Field unique name. Supports object path */
  name: string;
  defaultValue?: FormFieldValue;
  label?: string | JSX.Element;
  /** A sub-label below the field, acting as a description */
  sublabel?: string;
  placeholder?: string;
  type: Exclude<FormFieldType, "select" | "relation">;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validation?: (value: any) => string | null; // TODO: the validation should need to prevent the form from being submitted
  /** Some base style variant. Default is inline */
  variant?: "inline" | "compact"; // TODO: support variant
  /** If the field error is displayed as tooltip. Default is below the input */
  tooltipError?: boolean;
  /** If realtime, the validation will be done on input change, instead of on blur */
  realtime?: boolean; // TODO:
  inputConfig?: {
    filetype?: Array<"Images" | "Videos" | "Audios" | "Misc">;
    media?: Media;
    variant?: "full-size" | "inline";
    onClickInput?: (el?: FormField["name"] | FormFieldValue) => void;
    customLabel?: string | JSX.Element;
  };
  /** Additionnal style for the input. Only works with default input fields (exclude relation, file, select) */
  sx?: string;
  trigger?: FormTrigger;
  /** Is the field rendered ? Useful to have some values in a form field without associated input (ex. id) */
  hidden?: boolean;
}

export type AvailableFormRelation = ETableNames.tracks | ETableNames.links | ETableNames.albums | ETableNames.artists;

export interface RelationFormField<M extends boolean = boolean> extends Omit<BaseFormField, 'type'> {
  type: "relation";
  defaultValue?: SelectValue<M>;
  relation: {
    type: AvailableFormRelation;
    /** Is the relation configurable (can you add, modify, delete elements) */
    configurable?: boolean;
    /** Can you select multiple elements */
    multiple?: M;
    allowEmpty?: boolean;
    allowInsert?: boolean;
  };
};

export type SelectValue<M extends boolean> = M extends true ? FormFieldOptions[] : FormFieldOptions | undefined;
export interface SelectField<M extends boolean = boolean> extends Omit<BaseFormField, 'type'> {
  type: "select";
  // TODO: support one or
  defaultValue?: SelectValue<M>;
  multiple?: M;
  /** Max chip on the select before showing `+X`. Defaults to 3. */
  maxElementShown?: number;
  clearable?: boolean;
  /** A function set by the select, allowing to refresh options when called. */
  updateOptions?: () => Promise<void>;
  selectOptions?: (options: undefined | FormFieldOptions | FormFieldOptions[]) => void;
  options: (field: SelectField<M>) => Promise<FormFieldOptions[]>;
  validation?: (value: SelectValue<M>) => string | null;
}

export interface FormFieldOptions {
  value: string | object;
  label: ComponentChildren;
  chipLabel?: ComponentChildren;
  /** Action triggered when selecting the options. If returns null, the entry will not be selected. */
  onSelect?: (e: MouseEvent, value: FormFieldOptions) => void | null;
  onMouseEnter?: (e: MouseEvent, value: FormFieldOptions) => void;
  onMouseLeave?: (e: MouseEvent, value: FormFieldOptions) => void;
}

export const isFormFieldOption = (option: any): option is FormFieldOptions => {
  return option && typeof option === "object" && "value" in option && "label" in option;
};

export type FormField = BaseFormField | RelationFormField | SelectField;

export type FormFieldType =
  | "string"
  | "number"
  | "checkbox"
  | "select"
  | "multiselect"
  | "date"
  | "color"
  | "file"
  | "email"
  | "password"
  | "relation"
  | "markdown"
  /** The NI type is for Not Implemented */
  | "NI";

// TODO: correctly type this. The hard part is that it can be anything pretty much
export type FormFieldValue = any;
// | string
// | number
// | boolean
// | Date
// | File
// | string[]
// | null;

export const baseInputStyle = cn(
  "min-w-[180px] bg-background text-[15px] rounded-sm px-[5px] py-[3px] border-2 border-text text-text mx-0",
  "focus:border-main focus:outline-hidden focus:ring-0",
);

/** Type for a form field that is related to an object (saved in db)
 *
 * This way, the name will always be a key of the object, making it easier to use in forms
 */
export type ObjFormField<T> = Omit<FormField, "name"> & { name: Paths<T> };

/** This type is used to make interactive forms, by displaying forms fields
 * depending on the value of another field.
 */
export type FormTrigger = {
  /** The field name that will trigger the condition */
  fieldName: string[];
  /** The value that will trigger the condition. Must return true to display the field */
  condition: (v: FormFieldValue) => boolean;
};
