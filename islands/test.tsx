import { Button, Input, LabeledToolTip, Modal } from "@islands/UI";
import { IBrick } from "@models/Bricks.ts";
import ky from "ky";
import { useState } from "preact/hooks";

export default function Debug() {
  const field = {
    name: "test",
    type: 'select',
    label: <LabeledToolTip label="A label" text="description" />,
    multiple: true,
    options: async () => {
      const res = await ky.get(`/api/brick/getUserBricks/album`).json<IBrick[]>();
      return res.map((b) => ({
        value: b.collectionId,
        label: b.title,
      }));
    },
  };

  return (
    <div className="w-96">
      <Input field={field} onChange={(v) => console.log("Value changed: ", v)} />
      <Input field={{ ...field, multiple: false, label: "single" }} onChange={(v) => console.log("Value changed: ", v)} />
    </div>
  );
}

const NestedModalOpenButton = ({ deepness }: { deepness: number }) => {
  if (deepness <= 0) return null;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open nested modal</Button>
      <Modal openState={{ isOpen, setIsOpen }}>
        <>
          <NestedModalOpenButton deepness={deepness - 1} />
        </>
      </Modal>
    </>
  );
};
