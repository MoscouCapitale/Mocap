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
    <div className={`px-[5px] py-[3px] bg-main rounded-[3px] justify-start items-center gap-2.5 inline-flex ${props.className?.wrapper}`}>
      <button className={`text-text text-[15px] font-normal ${props.className?.button}`} onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  );
}
