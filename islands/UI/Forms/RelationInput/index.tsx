import { Button, ContextualDots, Modal, ObjectRenderer, Select } from "@islands/UI";
import { FormField, FormFieldOptions, FormFieldValue, SelectField } from "@models/Form.ts";
import { IconPlus, IconTrash } from "@utils/icons.ts";
import ky from "ky";
import { useEffect, useMemo, useState } from "preact/hooks";
import { AvailableAttributes, getAttributes } from "./relationManager.ts";

type RelationInputProps = {
  field: FormField;
  onChange: (value: FormFieldValue) => void;
};

export default function RelationInput({ field, onChange }: RelationInputProps) {
  // We need the config to correctly render the elements
  const attributeTable = field.relation?.type;

  const [updating, setUpdating] = useState<boolean>(false);
  //FIXME: rm "true". used to debug modals
  const [upsertedItem, setUpsertedItem] = useState<AvailableAttributes | true>(field.name === "link");

  const formattedField = useMemo<SelectField | null>(() => {

    if (!field.relation) return null;

    let defaultValue = field.defaultValue ?? "";
    // On a select field (with options), we need to convert the value to string to match the options in the select
    if (Array.isArray(defaultValue)) defaultValue = defaultValue.map((v) => String(v.id));
    if (defaultValue.id) defaultValue = [String(defaultValue.id)];

    return {
      ...field,
      type: "select",
      multiple: Boolean(field.relation?.multiple),
      // defaultValue,
      options: async () => {
        const attributes = await getAttributes(field.relation.type, true);
        let options: FormFieldOptions[] = attributes.map((a) => {
          const label = a.name ?? String(a.id);
          return {
            value: a,
            label: field.relation?.configurable ? (
              <div className="flex gap-4 justify-between items-center w-full">
                <p>{label}</p>
                <ContextualDots
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUpsertedItem(a);
                  }}
                />
              </div>
            ) : (
              label
            ),
            chipLabel: label,
          };
        });

        if (field.relation?.allowInsert) {
          options = [
            ...options,
            {
              value: "-1",
              label: (
                <div
                  className="flex gap-4 justify-between items-center w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUpsertedItem(true);
                  }}
                >
                  <p>Ajouter un élément</p>
                  <IconPlus className="text-text" size={20} />
                </div>
              ),
            },
          ];
        }
        return options;
      },
    };
  }, [field]);

  const upsertAttribute = () => {
    if (!upsertedItem || upsertedItem === true) return;
    setUpdating(true);

    const sendedBody = { ...upsertedItem };
    // Replace the full value of objects with the id, to correctly be saved in db.
    Object.keys(upsertedItem).forEach((key) => {
      if (typeof sendedBody[key] === "object" && sendedBody[key]?.id) sendedBody[key] = sendedBody[key].id;
    });

    ky.put(`/api/content/attributes/${field.relation?.type}`, { json: sendedBody }).then(() => {
      setUpdating(false);
      // fetchAttr(true);
    });
  };

  const deleteAttribute = () => {
    if (upsertedItem !== true && upsertedItem?.id) {
      ky.delete(`/api/content/attributes/${field.relation?.type}`, { json: upsertedItem }).then(() => {
        setUpsertedItem(undefined);
        // fetchAttr(true);
      });
    }
  };

  // TODO: fix this state, because if you modify the item, the state will be updated to "modified", even tho its a new item.
  const isUpsertedItemNew = useMemo(() => upsertedItem === true, [upsertedItem]);

  /** Set the default content of the ObjectRenderer. It onlmy changes when the id changes, to avoid re-rendering on each event */
  const defaultObjectContent = useMemo(() => (upsertedItem === true ? undefined : upsertedItem), [JSON.stringify(upsertedItem?.id ?? "")]);

  useEffect(() => console.log("DEBUG - upsertedItem: ", upsertedItem), [upsertedItem]);

  if (!field.relation) return null;

  return (
    <>
      {formattedField && <Select field={formattedField} onChange={(v) => onChange(v)} />}
      {attributeTable && upsertedItem && (
        <Modal openState={{ isOpen: !!upsertedItem, setIsOpen: (state) => setUpsertedItem(state ? true : undefined) }}>
          <div class="w-full flex flex-col gap-5">
            <div className="flex flex-col w-full gap-4">
              <ObjectRenderer type={attributeTable} content={defaultObjectContent} onChange={(v) => setUpsertedItem(v)} />
            </div>
            <div class="text-text flex align-center gap-4">
              <Button onClick={upsertAttribute} className={{ wrapper: "grow justify-center" }}>
                {updating ? "Enregistrement..." : `${isUpsertedItemNew ? "Créer" : "Modifier"}`}
              </Button>
              {!isUpsertedItemNew && <IconTrash className="text-error cursor-pointer" onClick={deleteAttribute} />}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
