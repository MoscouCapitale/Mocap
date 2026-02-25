// import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@utils/cn.ts";
import { IconX } from "@utils/icons.ts";
import { useState } from "preact/hooks";
import { Popover, PopoverProps } from "react-tiny-popover";
import { ComponentProps } from "preact/compat";

interface ModalProps extends Omit<ComponentProps<typeof Dialog>, "open" | "onClose"> {
  /** Default modal open state. Use this when uncontrolled (no `openState`) */
  open?: boolean;
  /** Manually control the modal state */
  openState?: { isOpen: boolean; setIsOpen?: (state: boolean) => void };
}

export default function Modal({ children, openState, classNames = {}, ...rest }: ModalProps) {
  const [isOpen, setIsOpen] = useState(rest.open ?? false);

  return (
    <Dialog
      // destroyOnHidden={!openState}
      {...rest}
      open={openState?.isOpen ?? isOpen}
      onClose={() => {
        if (openState?.setIsOpen) openState.setIsOpen(false);
        else setIsOpen(false);
      }}
      closeIcon={<IconX className="absolute -top-5 -right-5 text-text text-lg w-5 h-5 rounded-full" aria-label="Close" />}
      center
      classNames={{
        root: cn("", classNames.root),
        overlay: cn("bg-blur", classNames.overlay),
        overlayAnimationIn: cn("", classNames.overlayAnimationIn),
        overlayAnimationOut: cn("", classNames.overlayAnimationOut),
        modalContainer: cn("", classNames.modalContainer),
        modal: cn("", classNames.modal),
        modalAnimationIn: cn("", classNames.modalAnimationIn),
        modalAnimationOut: cn("", classNames.modalAnimationOut),
        closeButton: cn("", classNames.closeButton),
        closeIcon: cn("", classNames.closeIcon),
      }}
    >
      {children}
    </Dialog>
  );
}

// // import * as Dialog from "@radix-ui/react-dialog";
// import { cn } from "@utils/cn.ts";
// import { IconX } from "@utils/icons.ts";
// import { useState } from "preact/hooks";
// import { Modal as Dialog, ModalProps as DialogProps } from "react-responsive-modal";

// interface ModalProps extends Omit<DialogProps, "open" | "onClose"> {
//   /** Default modal open state. Use this when uncontrolled (no `openState`) */
//   open?: boolean;
//   /** Manually control the modal state */
//   openState?: { isOpen: boolean; setIsOpen?: (state: boolean) => void };
// }

// export default function Modal({ children, openState, classNames = {}, ...rest }: ModalProps) {
//   const [isOpen, setIsOpen] = useState(rest.open ?? false);

//   return (
//     <Dialog
//       // destroyOnHidden={!openState}
//       {...rest}
//       open={openState?.isOpen ?? isOpen}
//       onClose={() => {
//         if (openState?.setIsOpen) openState.setIsOpen(false);
//         else setIsOpen(false);
//       }}
//       closeIcon={<IconX className="absolute -top-5 -right-5 text-text text-lg w-5 h-5 rounded-full" aria-label="Close" />}
//       center
//       classNames={{
//         root: cn("", classNames.root),
//         overlay: cn("bg-blur", classNames.overlay),
//         overlayAnimationIn: cn("", classNames.overlayAnimationIn),
//         overlayAnimationOut: cn("", classNames.overlayAnimationOut),
//         modalContainer: cn("", classNames.modalContainer),
//         modal: cn("", classNames.modal),
//         modalAnimationIn: cn("", classNames.modalAnimationIn),
//         modalAnimationOut: cn("", classNames.modalAnimationOut),
//         closeButton: cn("", classNames.closeButton),
//         closeIcon: cn("", classNames.closeIcon),
//       }}
//     >
//       {children}
//     </Dialog>
//   );
// }
