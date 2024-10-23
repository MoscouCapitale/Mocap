import Button from "@islands/Button.tsx";
import { effect } from "@preact/signals-core";
import { VNode } from "preact";
import { useState } from "preact/hooks";

type ConfirmationModalProps = {
  isOpen: boolean;
  message: string | VNode;
  onConfirm: () => void;
  onCancel: () => void;
};

// TODO: instead of this element, we should make a Element wrapper, that, on click, add a confirm modal/popover/whatever to confirm the action

export default function ConfirmationModal(
  {
    isOpen: isOpenInitial,
    message,
    onConfirm,
    onCancel,
  }: ConfirmationModalProps,
) {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenInitial);

  effect(() => setIsOpen(isOpenInitial));

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return isOpen
    ? (
      <div
        className={"fixed top-0 left-0 w-screen h-screen bg-background bg-opacity-80 flex flex-col justify-center items-center p-10"}
        style={{ zIndex: "99999" }}
      >
        <div className={"text-text text-base"}>{message}</div>
        <div
          className={"w-full flex-row justify-center items-center gap-5 inline-flex"}
        >
          <Button
            onClick={handleCancel}
            variant="secondary"
          >Annuler</Button>
          <Button
            onClick={handleConfirm}
          >Confirmer</Button>
        </div>
      </div>
    )
    : null;
}
