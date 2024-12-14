import { Button } from "@islands/UI";
import { VNode } from "preact";
import Modal from "./Modal.tsx";

type ConfirmationModalProps = {
  isOpen: boolean;
  message: string | VNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({ isOpen, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <Modal
      openState={{ isOpen }}
      sx="top-0 left-0 h-full max-h-[100vh] w-full max-w-[100vw] border-0 bg-transparent backdrop-brightness-50 backdrop-blur-3xl flex flex-col justify-center items-center gap-10 rounded-none"
    >
      <>
        <div className={"text-text text-base"}>{message}</div>
        <div className={"w-full flex-row justify-center items-center gap-5 inline-flex"}>
          <Button onClick={onConfirm}>Confirmer</Button>
          <Button onClick={onCancel} variant="secondary">
            Annuler
          </Button>
        </div>
      </>
    </Modal>
  );
}
