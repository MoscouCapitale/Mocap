import { useState, useEffect } from "preact/hooks";
import { Button, Modal } from "@islands/UI";
import UploadMediaPopup from "./UploadMediaPopup.tsx";
import ky from "ky";

type AddButtonProps = {
  position?: string;
};

export default function AddButton({ position }: AddButtonProps) {
  const [openAddMediaInterface, setOpenAddMediaInterface] = useState<boolean>(false);

  useEffect(() => {
    if (typeof localStorage !== "undefined" && !localStorage.getItem("media_settings")) {
      ky.get("/api/settings/medias")
        .json()
        .then((res) => {
          localStorage.setItem("media_settings", JSON.stringify(res));
        });
    }
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setOpenAddMediaInterface(true);
        }}
        className={{ wrapper: position || "absolute top-[calc(2.5rem+0.625rem)] right-10" }}
      >
        Ajouter un média
      </Button>
      <Modal openState={{ isOpen: openAddMediaInterface, setIsOpen: setOpenAddMediaInterface }}>
        <UploadMediaPopup />
      </Modal>
    </>
  );
}
