import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

type Props = {
  value: string | number;
  onChange: (value: string) => void;
  label: string;
  type: string;
  addedButton?: JSX.Element;
  placeholder?: string;
  className?: {
    wrapper?: string;
    label?: string;
    input?: string;
  }
};

export default function InlineSingleInput(props: Props) {
  const [value, setValue] = useState(props.value);

  return (
    <div className={`justify-center items-center gap-10 inline-flex ${props.className?.wrapper ?? ""}`}>
      <p className={`text-text text-[15px] ${props.className?.label ?? ""}`}>{props.label}</p>
      <input
        className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0 ${props.className?.input ?? ""}`}
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
