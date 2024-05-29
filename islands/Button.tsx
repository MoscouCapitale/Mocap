import { cva } from "class-variance-authority";
import { cn } from "@utils/cn.ts";

type ButtonProps = {
  onClick: () => void;
  text: string;
  variant?: "primary" | "secondary";
  className?: {
    wrapper?: string;
    button?: string;
  };
};

export default function Button(props: ButtonProps) {
  const ButtonVariants = cva("rounded-[3px] justify-start items-center gap-2.5 inline-flex cursor-pointer", {
    variants: {
      variant: {
        primary: "px-[5px] py-[3px] bg-main",
        secondary: "px-[3px] py-[1px] bg-transparent border border-text",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  });

  return (
    <div className={cn(ButtonVariants({ variant: props.variant }), props.className?.wrapper)} onClick={props.onClick}>
      <button className={cn("text-text font-normal", props.className?.button)}>{props.text}</button>
    </div>
  );
}
