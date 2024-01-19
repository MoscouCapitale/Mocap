import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  type: string;
  addedButton?: JSX.Element;
  placeholder?: string;
  className?: string;
};

export default function InlineSingleInput(props: Props) {
  const [value, setValue] = useState(props.value);

  return (
    <div>
      <p>{props.label}</p>
      <input
        className={`bg-background rounded-[5px] px-2 py-[5px] text-text_grey text-base font-semibold ${props.className ?? ""}`}
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? ""}
        value={value}
        onChange={(e) => {
          const val = (e.target as HTMLInputElement).value;
          setValue(val);
          props.onChange(val);
        }}
      />
      {props.addedButton}
    </div>
  );
}
