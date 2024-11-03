import { cva } from "class-variance-authority";
import { cn } from "@utils/cn.ts";
import { JSX } from "preact";

type LinkProps = {
  variant?: "default" | "footer";
  sx?: string;
} & JSX.IntrinsicElements["a"];

/** Link wrapper component, using Mocap styling
 * 
 * @param {string} variant - The variant of the link. Defaults to "default"
 * @param {string} sx - An additional class to apply to the link.
 */
export default function Link({
  variant = "default",
  sx,
  ...props
}: LinkProps) {
  const ButtonVariants = cva("text-text underline transition-all", {
    variants: {
      variant: {
        default: "",
        footer: "text-grey font-semibold hover:text-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  return (
    <a
      className={cn(ButtonVariants({ variant }), sx)}
      {...props}
    />
  );
}
