import { cn } from "@utils/cn.ts";
import { JSX } from "preact/jsx-runtime";
import { Media } from "@models/Medias.ts";
import { Paths } from "@models/App.ts";

export type InputError = {
  error: boolean;
  field: string;
  message: string;
};

// TODO: Support for all of these fields
export interface FormField {
  name: string;
  defaultValue?: FormFieldValue;
  label?: string | JSX.Element;
  /** A sub-label below the field, acting as a description */
  sublabel?: string;
  placeholder?: string;
  type: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Options of the select */
  options?: FormFieldOptions[];
  validation?: (value: any) => string | null; // TODO: the validation should need to prevent the form from being submitted
  /** Some base style variant. Default is inline */
  variant?: "inline" | "compact"; // TODO: support variant
  /** If the field error is displayed as tooltip. Default is below the input */
  tooltipError?: boolean;
  /** If realtime, the validation will be done on input change, instead of on blur */
  realtime?: boolean; // TODO:
  relation?: FormFieldRelation;
  inputConfig?: {
    filetype?: Array<"Images" | "Videos" | "Audios" | "Misc">;
    media?: Media;
    onClickInput?: (el?: FormField["name"]) => void;
    customLabel?: string | JSX.Element;
  };
  /** Additionnal style for the input. Only works with default input fields (exclude relation, file, select) */
  sx?: string;
  trigger?: FormTrigger;
}

export interface FormFieldOptions {
  value: string;
  label: string | JSX.Element;
}

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

export type FormFieldRelation = {
  type: AvailableFormRelation;
  /** Is the relation configurable (can you add, modify, delete elements) */
  configurable?: boolean;
  /** Can you select multiple elements */
  multiple?: boolean;
  allowEmpty?: boolean;
  allowInsert?: boolean;
};

export type AvailableFormRelation =
  | "cta"
  | "controls"
  | "platforms"
  | "platform"
  | "tracklist"
  | "track"
  | "artist";

export const baseInputStyle = cn(
  "min-w-[180px] bg-background text-[15px] rounded px-[5px] py-[3px] border-2 border-text text-text mx-0",
  "focus:border-main focus:outline-none focus:ring-0",
);

/** Type for a form field that is related to an object (saved in db)
 *
 * This way, the name will always be a key of the object, making it easier to use in forms
 */
export type ObjFormField<T> = Omit<FormField, "name"> & { name: Paths<T> }

/** This type is used to make interactive forms, by displaying forms fields
 * depending on the value of another field.
 */
export type FormTrigger = {
  /** The field name that will trigger the condition */
  fieldName: string[];
  /** The value that will trigger the condition. Must return true to display the field */
  condition: (v: FormFieldValue) => boolean;
}