import { Button, ContextualDots, ObjectRenderer, Select, useModal } from "@islands/UI";
import { FormFieldOptions, FormFieldValue, RelationFormField, SelectField } from "@models/Form.ts";
import { IconPlus, IconTrash } from "@utils/icons.ts";
import ky from "ky";
import { useMemo, useState } from "preact/hooks";
import { AvailableAttributes, getAttributes } from "./relationManager.ts";

type RelationInputProps = {
  field: RelationFormField;
  onChange: (value: FormFieldValue) => void;
};

export default function RelationInput({ field, onChange }: RelationInputProps) {
  // We need the config to correctly render the elements
  const attributeTable = field.relation?.type;

  const [updating, setUpdating] = useState<boolean>(false);
  const [upsertedItem, setUpsertedItem] = useState<AvailableAttributes>();

  const { setIsOpen, Modal } = useModal();

  /** RelationField to SelectField */
  const formattedField = useMemo<SelectField>(
    () => ({
      ...field,
      type: "select",
      multiple: Boolean(field.relation.multiple),
      defaultValue: field.defaultValue,
      updateOptions: async () => {},
      ...(field.relation.allowEmpty ? { clearable: true } : {}),
      options: async () => {
        const attributes = await getAttributes(field.relation!.type, true);
        const options: FormFieldOptions[] = attributes.map((a) => {
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
                    setIsOpen(true);
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
          options.push({
            value: {},
            label: (
              <div className="flex gap-4 justify-between items-center w-full">
                <p>Ajouter un élément</p>
                <IconPlus className="text-text" size={20} />
              </div>
            ),
            onSelect: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
              return null;
            },
          });
        }
        return options;
      },
    }),
    [field.name],
  );

  const upsertAttribute = () => {
    console.log("Upsered", upsertedItem);
    if (upsertedItem) {
      setUpdating(true);
      ky.put(`/api/content/attributes/${field.relation?.type}`, { json: upsertedItem })
        .then(() => {
          formattedField.updateOptions!();
          setUpsertedItem(undefined);
          setIsOpen(false);
        })
        .finally(() => setUpdating(false));
    }
  };

  const deleteAttribute = () => {
    console.log("Upsered", upsertedItem);
    if (upsertedItem?.id) {
      ky.delete(`/api/content/attributes/${field.relation?.type}`, { json: upsertedItem }).then(() => {
        formattedField.updateOptions!();
        setUpsertedItem(undefined);
        setIsOpen(false);
      });
    }
  };

  const isNewItem = !upsertedItem?.id;

  return (
    <>
      <Select field={formattedField} onChange={(v) => onChange(Array.isArray(v) ? v.map((v) => v.value) : v?.value)} />
      <Modal onClose={() => setUpsertedItem(undefined)}>
        <div class="flex flex-col gap-4 w-80 mx-auto">
          <label className="text-text font-bold">{formattedField.label}</label>
          <ObjectRenderer
            type={attributeTable!}
            content={typeof upsertedItem === "object" ? upsertedItem : undefined}
            onChange={(v) => setUpsertedItem(v as typeof upsertedItem)}
          />
          <div class="text-text flex align-center gap-4 mt-4">
            <Button onClick={upsertAttribute} className={{ wrapper: "grow justify-center" }}>
              {updating ? "Enregistrement..." : `${isNewItem ? "Créer" : "Modifier"}`}
            </Button>
            {!isNewItem && <IconTrash className="text-error cursor-pointer" onClick={deleteAttribute} />}
          </div>
        </div>
      </Modal>
    </>
  );
}
