import { useState } from "preact/hooks";
import { Button, Modal } from "@islands/UI";
import UploadMediaPopup from "./UploadMediaPopup.tsx";

type AddButtonProps = {
  position?: string;
};

export default function AddButton({position}: AddButtonProps) {
  const [openAddMediaInterface, setOpenAddMediaInterface] = useState<boolean>(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenAddMediaInterface(true);
        }}
        className={{ wrapper: position || "absolute top-[calc(2.5rem+0.625rem)] right-10" }}
      >Ajouter un média</Button>
      <Modal openState={{ isOpen: openAddMediaInterface, setIsOpen: setOpenAddMediaInterface }}>
        <UploadMediaPopup />
      </Modal>      
    </>
  );
}
