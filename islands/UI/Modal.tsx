import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@utils/cn.ts";
import { IconX } from "@utils/icons.ts";
import { VNode } from "preact";
import { useState } from "preact/hooks";

interface ModalProps {
  children: VNode;
  /** Whether the modal is open by default */
  defaultOpen?: boolean;
  /** Manually control the modal state */
  openState?: { isOpen: boolean; setIsOpen?: (state: boolean) => void };
  /** Additionnal styling */
  sx?: string;
}

export default function Modal({ children, defaultOpen, openState, sx }: ModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // TODO: check that the modal feature are finished, and replaced everywhere in code

  return (
    <Dialog.Root
      open={openState?.isOpen ?? isOpen}
      onOpenChange={(state: boolean) => {
        if (openState?.setIsOpen) openState.setIsOpen(state);
        else setIsOpen(state);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-60 backdrop-blur-sm fixed inset-0 z-30" />
        <Dialog.Content
          className={cn(
            "z-30 fixed pos-center max-h-[85vh] w-fit max-w-[800px] min-w-[100px] min-h-[100px]", // Pos & size
            "bg-background p-5 rounded-xl",
            "border-2 border-[#101010]",
            sx
          )}
        >
          {children}
          <Dialog.Close asChild>
            <IconX className="absolute -top-5 -right-5 text-text text-lg w-5 h-5 rounded-full" aria-label="Close" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
