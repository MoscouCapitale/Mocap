import { useEffect, useRef } from "preact/hooks";
import { VNode } from "preact";
import { IconX } from "@utils/icons.ts";

interface InpagePopupProps {
  children: VNode;
  closePopup: () => void;
}

export default function InpagePopup({ children, closePopup }: InpagePopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopup();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [containerRef.current, closePopup]);

  return (
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div
        ref={containerRef}
        class="relative bg-background p-7 rounded-2xl"
        // TODO: fix shadow
        style={{
          boxShadow:
            "1px 1px 4px rgba(204, 216, 247, 0.01),4px 4px 17px rgba(204, 216, 247, 0.02),8px 8px 37px rgba(204, 216, 247, 0.03),14px 14px 66px rgba(204, 216, 247, 0.03),22px 22px 104px rgba(204, 216, 247, 0.04),32px 32px 149px rgba(204, 216, 247, 0.05),44px 44px 203px rgba(204, 216, 247, 0.06);",
        }}
      >
        {children}
        <IconX class="absolute -top-2 -right-2 text-text bg-background p-1 text-lg w-7 h-7 rounded-full stroke-current stroke-[3]" onClick={closePopup} />
      </div>
    </div>
  );
}
