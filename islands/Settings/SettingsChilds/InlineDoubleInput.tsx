import { useEffect, useState } from "preact/hooks";

type Props = {
  label: string;
  value_first: string;
  onChange_first: (value: string) => void;
  placeholder_first?: string;
  type_first?: string;
  className_first?: string;
  width_first?: string[];
  value_second: string;
  onChange_second: (value: string) => void;
  placeholder_second?: string;
  type_second?: string;
  className_second?: string;
  width_second?: string[];
};

export default function InlineDoubleInput(props: Props) {
  const [value_first, setValue_first] = useState(props.value_first);
  const [value_second, setValue_second] = useState(props.value_second);

  return (
    <div>
      <div>{props.label}</div>
      <input
        className={`bg-background rounded-[5px] px-2 py-[5px] text-text_grey text-base font-semibold ${props.className_first ?? ""}`}
        type={props.type_first ?? "text"}
        placeholder={props.placeholder_first ?? ""}
        value={value_first}
        onChange={(e) => {
          const val = (e.target as HTMLInputElement).value;
          setValue_first(val);
          props.onChange_first(val);
        }}
      />
      <input
        className={`bg-background rounded-[5px] px-2 py-[5px] text-text_grey text-base font-semibold ${props.className_second ?? ""}`}
        type={props.type_second ?? "text"}
        placeholder={props.placeholder_second ?? ""}
        value={value_second}
        onChange={(e) => {
          const val = (e.target as HTMLInputElement).value;
          setValue_second(val);
          props.onChange_second(val);
        }}
      />
    </div>
  );
}
