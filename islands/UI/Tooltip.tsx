// import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  IconInfoCircle as InfoIcon,
  IconInfoSmall as InfoIconNoBorder,
} from "@utils/icons.ts";
import { JSX } from "preact";
import { cn } from "@utils/cn.ts";
import { useCallback, useState } from "preact/hooks";

type TooltipProps = {
  text: string;
  Icon?: "default" | "no-border" | JSX.Element;
};

export const Tooltip = (
  { text, Icon = "default" }: TooltipProps,
) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center"
          onMouseLeave={() => open && setOpen(false)}
        >
          {Icon === "default"
            ? <InfoIcon className={"text-text"} />
            : Icon === "no-border"
            ? <InfoIconNoBorder className={"text-text"} />
            : Icon}
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="top"
          sideOffset={2}
          className={cn(
            "select-none rounded bg-black px-[15px] py-2.5 text-[15px] leading-none text-text",
            "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
            "will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-tooltip-slideAndFade",
          )}
        >
          {text}
          <PopoverClose />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

type LabeledToolTipProps = {
  label: string;
};

export const LabeledToolTip = ({
  label,
  ...props
}: LabeledToolTipProps & TooltipProps) => (
  <div className={"flex items-center gap-1"}>
    <span>{label}</span>
    <Tooltip Icon={"no-border"} {...props} />
  </div>
);
