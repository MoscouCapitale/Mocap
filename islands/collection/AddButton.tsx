import { Button, useModal } from "@islands/UI";
import ky from "ky";
import { useEffect, useState } from "preact/hooks";
import UploadMediaPopup from "./UploadMediaPopup.tsx";

type AddButtonProps = {
  position?: string;
};

export default function AddButton({ position }: AddButtonProps) {
  const { setIsOpen: setOpenAddMediaInterface, Modal } = useModal();

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
      <Modal>
        <UploadMediaPopup />
      </Modal>
    </>
  );
}
