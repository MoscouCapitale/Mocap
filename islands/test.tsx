import { Button, Input, LabeledToolTip, Select, useModal } from "@islands/UI";
import { IBrick } from "@models/Bricks.ts";
import ky from "ky";
import { useState } from "preact/hooks";
import { SelectField } from "@models/Form.ts";
import RelationInput from "./UI/Forms/RelationInput/index.tsx";

export default function Debug() {
  const field = {
    name: "test",
    type: "select",
    label: <LabeledToolTip label="A label" text="description" />,
    multiple: true,
    options: async () => {
      const res = await ky.get(`/api/brick/getUserBricks/album`).json<IBrick[]>();
      return res.map((b) => ({
        value: b.id,
        label: b.title,
      }));
    },
  };

  return (
    <div className="w-96">
      <Input field={field} onChange={(v) => console.log("Value changed: ", v)} />
      <Input field={{ ...field, multiple: false, label: "single" }} onChange={(v) => console.log("Value changed: ", v)} />
      <Input
        field={{
          name: "relation",
          type: "relation",
          label: "Relation SINGLE",
          relation: {
            type: "links",
            configurable: true,
            multiple: false,
            allowEmpty: true,
            allowInsert: true,
          },
        }}
        onChange={(v) => {}}
      />
      <Input
        field={{
          name: "relation",
          type: "relation",
          label: "Relation MULTIPLE",
          relation: {
            type: "links",
            configurable: true,
            multiple: true,
            allowEmpty: true,
            allowInsert: true,
          },
        }}
        onChange={(v) => {}}
      />
      <Select field={field} onChange={(v) => console} />
    </div>
  );
}

const NestedModalOpenButton = ({ deepness }: { deepness: number }) => {
  if (deepness <= 0) return null;

  const { setIsOpen, Modal } = useModal();

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open nested modal</Button>
      <Modal>
        <NestedModalOpenButton deepness={deepness - 1} />
      </Modal>
    </>
  );
};
