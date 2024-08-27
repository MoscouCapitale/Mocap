import { useEffect, useRef } from "preact/hooks";
import { VNode } from "preact";
import { IconX } from "@utils/icons.ts";
import * as Dialog from "@radix-ui/react-dialog";

interface InpagePopupProps {
  children: VNode;
  isOpen: boolean;
  closePopup: () => void;
}

export default function InpagePopup(
  { children, isOpen, closePopup }: InpagePopupProps,
) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(state: boolean) => {
        if (!state) closePopup();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="z-50 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] bg-background p-7 border-2 border-grey rounded-2xl">
          {children}
          <Dialog.Close asChild>
            <IconX
              className="absolute -top-2 -right-2 text-text bg-background p-2 text-lg w-10 h-10 rounded-full stroke-current stroke-[3] border-2 border-grey"
              aria-label="Close"
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
