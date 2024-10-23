import { useState } from "preact/hooks";
import Button from "@islands/Button.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
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
      <InpagePopup isOpen={openAddMediaInterface} closePopup={() => setOpenAddMediaInterface(false)}>
        <UploadMediaPopup />
      </InpagePopup>      
    </>
  );
}
