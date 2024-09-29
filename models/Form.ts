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
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
  /** Some base style variant. Default is inline */
  variant?: "inline" | "compact";
  /** If the field error is displayed as tooltip. Default is below the input */
  tooltipError?: boolean;
  /** If realtime, the validation will be done on input change, instead of on blur */
  realtime?: boolean
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
  | "password";

export type FormFieldValue =
  | string
  | number
  | boolean
  | Date
  | File
  | string[]
  | null;
