type ButtonProps = {
  onClick: () => void;
  text: string;
  className?: {
    wrapper?: string;
    button?: string;
  };
};

export default function Button(props: ButtonProps) {
  return (
    <div className={`px-[5px] py-[3px] bg-main rounded-[3px] justify-start items-center gap-2.5 inline-flex cursor-pointer ${props.className?.wrapper}`}  onClick={props.onClick}>
      <button className={`text-text text-[15px] font-normal ${props.className?.button}`}>
        {props.text}
      </button>
    </div>
  );
}
