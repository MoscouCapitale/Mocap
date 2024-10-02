import { cn } from "@utils/cn.ts";

export type InputError = {
  error: boolean;
  field: string;
  message: string;
};

// TODO: find the value and formData type of validation
export interface FormField {
  name: string;
  defaultValue?: FormFieldValue;
  label?: string;
  /** A sub-label below the field, acting as a description */
  sublabel?: string;
  placeholder?: string;
  type: FormFieldType;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Options of the select */
  options?: FormFieldOptions[];
  validation?: (value: any) => string | null;
  /** Some base style variant. Default is inline */
  variant?: "inline" | "compact";
  /** If the field error is displayed as tooltip. Default is below the input */
  tooltipError?: boolean;
  /** If realtime, the validation will be done on input change, instead of on blur */
  realtime?: boolean;
}

export interface FormFieldOptions {
  value: string;
  label: string;
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
  /** The NI type is for Not Implemented */
  | "NI";

export type FormFieldValue =
  | string
  | number
  | boolean
  | Date
  | File
  | string[]
  | null;

export const baseInputStyle = cn(
  "min-w-[200px] bg-background text-[15px] rounded px-[5px] py-[3px] border-2 border-text text-text mx-0",
  "focus:border-main focus:outline-none focus:ring-0",
);
