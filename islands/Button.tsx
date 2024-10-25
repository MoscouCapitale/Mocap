import { cva } from "class-variance-authority";
import { cn } from "@utils/cn.ts";
import { VNode } from "preact";

type ButtonProps = {
  children?: VNode | string | string[];
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: {
    wrapper?: string;
    button?: string;
  };
  icon?: VNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className,
  icon,
  disabled = false,
  type = "button",
}: ButtonProps) {
  const ButtonVariants = cva("rounded-[3px] justify-start items-center gap-2.5 inline-flex cursor-pointer", {
    variants: {
      variant: {
        primary: "px-[5px] py-[3px] bg-main",
        secondary: "px-[3px] py-[1px] bg-transparent border border-text",
        danger: "px-[3px] py-[1px] border border-error",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  });

  return (
    <div
      className={cn(ButtonVariants({ variant }), className?.wrapper, disabled && "filter grayscale opacity-50")}
      onClick={(e) => {
        if (onClick) onClick();
        if (href) window.location.href = href;
      }}
    >
      {icon}
      <button
        className={cn("text-text font-normal", className?.button)}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    </div>
  );
}
