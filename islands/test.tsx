import { Button, Modal } from "@islands/UI";
import { useState } from "preact/hooks";

export default function Debug() {
  return (
    <>
      <h1>Debug page</h1>
      <NestedModalOpenButton deepness={5} />
    </>
  );
}

const NestedModalOpenButton = ({ deepness }: { deepness: number }) => {
  if (deepness <= 0) return null;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open nested modal</Button>
      <Modal openState={{ isOpen, setIsOpen }}>
        <><NestedModalOpenButton deepness={deepness - 1} /></>
      </Modal>
    </>
  );
};
