import { VNode } from "preact";
import { useState } from "preact/hooks";
import { cn } from "@utils/cn.ts";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@radix-ui/react-popover";

type ContextualDotsProps =
  | { onClick: () => void; popoverChildren?: never }
  | { onClick?: never; popoverChildren: VNode };

export default function ContextualDots(
  { onClick, popoverChildren }: ContextualDotsProps,
) {
  const [isActive, setIsActive] = useState(false);

  return onClick
    ? (
      <button
        className="group gap-[3px] inline-flex top-0 right-0 p-2 rounded-bl"
        onClick={() => {
          if (onClick) onClick();
          setIsActive((p) => !p);
        }}
      >
        <ThreeDots isActive={isActive} />
      </button>
    )
    : (
      <Popover>
        <PopoverTrigger>
          <button
            className="group gap-[3px] inline-flex top-0 right-0 p-2 rounded-bl"
            onClick={() => setIsActive((p) => !p)}
          >
            <ThreeDots isActive={isActive} />
          </button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent align="end">
            {popoverChildren}
            <PopoverClose />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    );
}

function ThreeDots({ isActive }: { isActive: boolean }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block w-2 h-2 rounded-full border-2 border-text transition-transform duration-300 ease-in-out",
            i === 1
              ? isActive
                ? "transform translate-y-1"
                : "group-hover:-translate-y-1"
              : "",
          )}
        />
      ))}
    </>
  );
}
