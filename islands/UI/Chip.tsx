import { ComponentChildren } from "preact";
import { cn } from "@utils/cn.ts";
import { IconX } from "@utils/icons.ts";

export default function Chip({ children, onDelete, sx }: { children: ComponentChildren; onDelete?: (e: MouseEvent) => void; sx?: string }) {
  return (
    <div className={cn("flex gap-1 max-w-20 rounded-full p-1 bg-black/30 text-text", sx)}>
      <div className="grow truncate">{children}</div>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDelete(e);
          }}
        >
          <IconX size={16} />
        </button>
      )}
    </div>
  );
}
