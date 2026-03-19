import { effect } from "@preact/signals";
import { cn } from "@utils/cn.ts";
import { generateCollectionEntryId } from "@utils/db.ts";
import { IconX } from "@utils/icons.ts";
import { type ClassValue } from "clsx";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Popover, PopoverProps } from "react-tiny-popover";

const MODAL_NAME = "popover-modal";

/** Get the current modal number on the page. Used to proper */
const getModalIndex = (uid: string) => {
  const allPopover: string[] = [];
  if (globalThis?.document) {
    globalThis.document.querySelectorAll(`body > div.${MODAL_NAME}`).forEach((e) => allPopover.push(e.className));
  }
  return Math.max(
    0,
    allPopover.findIndex((c) => c.includes(uid)),
  );
};

interface ModalProps extends Omit<PopoverProps, "isOpen" | "content"> {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  onClose?: (reason: "icon" | "backdrop", event: MouseEvent | KeyboardEvent) => void;
  sx?: {
    container?: ClassValue;
    overlay?: ClassValue;
    content?: ClassValue;
    closeButton?: ClassValue;
    closeIcon?: ClassValue;
  };
}

export default function useModal({
  defaultOpen,
  // open,
}: {
  /** The default open state of the modal */
  defaultOpen?: boolean;
  /** The current modal state. Use this to manage the open state based on a Boolean value. */
  // open?: unknown;
} = {}) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);

  // Keep a ref to the latest state so the memoized Modal wrapper always reads current values
  const stateRef = useRef({ isOpen, setIsOpen });
  stateRef.current = { isOpen, setIsOpen };

  // Memoize the wrapper so its identity never changes — prevents Preact from remounting the subtree
  const StableModal = useMemo(() => {
    const Wrapper = (props: Omit<ModalProps, "isOpen" | "setIsOpen">) => (
      <Modal isOpen={stateRef.current.isOpen} setIsOpen={stateRef.current.setIsOpen} {...props} />
    );
    Wrapper.displayName = "ModalWrapper";
    return Wrapper;
  }, []);

  return {
    isOpen,
    setIsOpen,
    Modal: StableModal,
  };
}

const Modal = ({ isOpen, setIsOpen, onClose, sx = {}, children, ...rest }: ModalProps) => {
  const uid = useRef(generateCollectionEntryId());
  const [index, setIndex] = useState(0);

  const closeModal: NonNullable<ModalProps>["onClose"] = (r, e) => {
    e.preventDefault();
    setIsOpen(false);
    onClose?.(r, e);
  };

  useEffect(() => {
    if (isOpen) setIndex(getModalIndex(uid.current));
  }, [isOpen]);

  return (
    <Popover
      {...rest}
      isOpen={isOpen}
      containerClassName={cn(MODAL_NAME, uid.current, sx.container)}
      content={() => (
        <>
          <div
            // If first modal, dark backdrop and little blur. For the one above it, make it only more blurry, fading the content but not darkening the page
            className={cn("fixed inset-0 z-30", index > 0 ? "backdrop-blur-sm" : "bg-black/60 backdrop-blur-xs", sx.overlay)}
            onClick={(e) => closeModal("backdrop", e)}
          />
          <div
            className={cn(
              "z-30 fixed pos-center max-h-[85vh] max-w-200 min-w-50 min-h-50", // Pos & size
              "bg-background p-5 rounded-xl",
              "border-2 border-[#101010]",
              sx.content,
            )}
          >
            {children}
            <button
              className={cn("absolute -top-8 -right-8 flex items-center justify-center p-2 cursor-pointer", sx.closeButton)}
              type="button"
              onClick={(e) => closeModal("icon", e)}
            >
              <IconX className={cn("-w-6 h-6 text-text text-lg", sx.closeIcon)} aria-label="Close" />
            </button>
          </div>
        </>
      )}
    >
      {null}
    </Popover>
  );
};
