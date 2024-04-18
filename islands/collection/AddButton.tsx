import { useState } from "preact/hooks";
import Button from "@islands/Button.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import AddPopup from "@islands/collection/AddPopup.tsx";

export default function AddButton() {
  const [openAddMediaInterface, setOpenAddMediaInterface] = useState<boolean>(false);

  return (
    <>
      <Button
        text={`Ajouter un média`}
        onClick={() => {
          setOpenAddMediaInterface(true);
        }}
        className={{ wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-10" }}
      />
      {openAddMediaInterface && (
        <InpagePopup closePopup={() => setOpenAddMediaInterface(false)}>
          <AddPopup />
        </InpagePopup>
      )}
    </>
  );
}
