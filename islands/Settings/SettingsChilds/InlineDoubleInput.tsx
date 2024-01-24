import { useEffect, useState } from "preact/hooks";

type Props = {
  label: string;
  className?: {
    wrapper?: string;
    label?: string;
    input_first?: string;
    input_second?: string;
  };

  value_first: string;
  onChange_first: (value: string) => void;
  placeholder_first?: string;
  type_first?: string;

  value_second: string;
  onChange_second: (value: string) => void;
  placeholder_second?: string;
  type_second?: string;
};

export default function InlineDoubleInput(props: Props) {
  const [value_first, setValue_first] = useState(props.value_first);
  const [value_second, setValue_second] = useState(props.value_second);

  return (
    <div className={`justify-center items-center gap-10 inline-flex ${props.className?.wrapper ?? ""}`}>
      <p className={`text-text text-[15px] ${props.className?.label ?? ""}`}>{props.label}</p>
      <input
        className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0 ${
          props.className?.input_first ?? ""
        }`}
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
        className={`bg-background text-[15px] rounded px-[5px] py-[3px] border border-2 border-text justify-start items-center gap-2.5 inline-flex text-text focus:border-main focus:outline-none focus:ring-0 ${
          props.className?.input_second ?? ""
        }`}
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
