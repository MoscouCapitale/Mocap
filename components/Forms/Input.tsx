import { InputError } from "@models/Form.ts";

type Props = {
  formType: "auth" | "contact";
  type: HTMLInputElement["type"];
  name: string;
  placeholder: string;
  value: HTMLInputElement["value"];
  onChange: (e: Event) => void;
  error?: InputError;
};

export default function Input(
  { formType, type, name, placeholder, value, onChange, error }: Props,
) {
  console.log(error);
  return (
    <input
      className={`w-full border-b-2 rounded-none border-text bg-background py-1 text-text focus:border-main transition-all duration-200 ease-in-out outline-none ${
        error?.error
          ? "ring-1 ring-error ring-offset-4 ring-offset-background rounded-sm"
          : ""
      }`}
      type={type}
      name={name}
      placeholder={error?.error ? error.message : placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
