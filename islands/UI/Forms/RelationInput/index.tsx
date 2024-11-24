import { AvailableFormRelation, FormField, FormFieldOptions, FormFieldValue } from "@models/Form.ts";
import { MediaSettingsAttributes } from "@models/Medias.ts";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { AvailableAttributes, getAttributes } from "@islands/UI/Forms/RelationInput/relationManager.ts";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import { AllMocapObjectsTypes } from "@models/forms/bricks.tsx";
import { DatabaseAttributes } from "@models/App.ts";
import { Button, ContextualDots, ObjectRenderer, Select } from "@islands/UI";
import { IconPlus, IconTrash } from "@utils/icons.ts";

type RelationInputProps = {
    field: FormField;
  onChange: (value: FormFieldValue) => void;
};

export default function RelationInput(
  { field, onChange }: RelationInputProps,
) {
  // We need the config to correctly render the elements
  if (!field.relation) return null;
  const attributeTable = useMemo(() => getAttributeFromKey(field.relation?.type ?? "artist"), [field.relation]);

  /** The formatted field, with all the correct options */
  const [formattedField, setFormattedField] = useState<FormField | null>(null);

  const [allAttributes, setAllAttributes] = useState<AvailableAttributes[] | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [upsertedItem, setUpsertedItem] = useState<AvailableAttributes | true>();

  const handleSelectChange = useCallback((v: FormFieldOptions["value"][]) => {
    if (!allAttributes) return;
    const elements = v ? allAttributes.filter((att) => v.includes(String(att.id))) : [];
    onChange(elements);
  }, [allAttributes]);

  const convertRelationToSelecItem = useCallback((attributes: AvailableAttributes[]): FormField => {
    let options: FormFieldOptions[] = attributes.map((a) => {
      // @ts-expect-error - Yes there is no attribute, this is why I use the nullish operator
      const label = a.label ?? a.name ?? String(a.id);
      return ({
        value: String(a.id),
        label: field.relation?.configurable
          ? (
            <div className={"flex gap-4 justify-between items-center w-full"}>
              <p>{label}</p>
              <ContextualDots
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUpsertedItem(a);
                }}
              />
            </div>
          )
          : label,
      });
    });

    if (field.relation?.allowInsert) {
      options = [...options, {
        value: "-1",
        label: (
          <div
            className={"flex gap-4 justify-between items-center w-full"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUpsertedItem(true);
            }}
          >
            <p>Ajouter un élément</p>
            <IconPlus className={"text-text"} size={20} />
          </div>
        ),
      }];
    }

    let defaultValue = field.defaultValue ?? "";
    // On a select field (with options), we need to convert the value to string to match the options in the select
    if (field.relation && Array.isArray(defaultValue)) defaultValue = defaultValue.map((v: any) => String(v.id));
    if (field.relation && defaultValue.id) defaultValue = [String(defaultValue.id)];

    return (
      {
        ...field,
        options,
        defaultValue,
      }
    );
  }, [field]);

  const fetchAttr = useCallback(async (type?: "auto" | true) => {
    if (!field.relation) return [];
    const attr = await getAttributes(field.relation.type, type);
    setAllAttributes(attr);
    setFormattedField(convertRelationToSelecItem(attr));
  }, [field.relation]);

  useEffect(() => {
    fetchAttr("auto");
  }, []);

  const upsertAttribute = () => {
    if (!upsertedItem || upsertedItem === true) return;
    setUpdating(true);

    const sendedBody = { ...upsertedItem };
    // Replace the full value of objects with the id, to correctly be saved in db.
    Object.keys(upsertedItem).forEach((key) => {
      // @ts-expect-error - The typing here is not great.
      if (typeof sendedBody[key] === "object" && sendedBody[key]?.id) sendedBody[key] = sendedBody[key].id;
    });

    console.log("sendedBody", sendedBody);

    fetch(`/api/content/attributes/${field.relation?.type}`, { method: "PUT", body: JSON.stringify(sendedBody) })
      .finally(() => {
        setUpdating(false);
        fetchAttr(true);
      });
  };

  const deleteAttribute = () => {
    if (upsertedItem !== true && upsertedItem?.id) {
      fetch(`/api/content/attributes/${field.relation?.type}`, { method: "DELETE", body: JSON.stringify(upsertedItem) })
        .then(() => {
          setUpsertedItem(undefined);
          // setDropdownItems(dropdownItems?.filter((item) => item.id !== itemDetail.id));
          // selectItem(createEmptyItem(table));
        })
        .finally(() => fetchAttr(true));
    }
  };

  // TODO: fix this state, because if you modify the item, the state will be updated to "modified", even tho its a new item.
  const isUpsertedItemNew = useMemo(() => upsertedItem === true, [upsertedItem]);

  /** Set the default content of the ObjectRenderer. It onlmy changes when the id changes, to avoid re-rendering on each event */
  // @ts-expect-error - Id does not exist on 'true', this is why I use the nullish operator
  const defaultObjectContent = useMemo(() => upsertedItem === true ? undefined : upsertedItem, [JSON.stringify(upsertedItem?.id ?? "")]);

  return (
    <>
      {formattedField && (
        <Select
          field={formattedField}
          multiSelect={!!formattedField.relation?.multiple}
          onChange={handleSelectChange}
          min={formattedField.relation?.allowEmpty ? 0 : 1}
          error={null}
          customLabels={(vals) => vals.length ? `${vals.length} sélectionnés` : " "}
          sx="w-full"
        />
      )}
      {attributeTable && upsertedItem && (
        <InpagePopup
          isOpen={!!upsertedItem}
          closePopup={() => setUpsertedItem(undefined)}
        >
          <div class="w-full flex flex-col gap-5">
            <div className={"flex flex-col w-full gap-4"}>
              <ObjectRenderer
                type={attributeTable}
                content={defaultObjectContent}
                onChange={(v) => setUpsertedItem(v as AvailableAttributes)}
              />
            </div>
            <div class="text-text flex align-center gap-4">
              <Button
                onClick={upsertAttribute}
                className={{ wrapper: "grow justify-center" }}
              >{updating ? "Enregistrement..." : `${isUpsertedItemNew ? "Créer" : "Modifier"}`}</Button>
              {!isUpsertedItemNew &&
                <IconTrash className={"text-error cursor-pointer"} onClick={deleteAttribute} />}
            </div>
          </div>
        </InpagePopup>
      )}
    </>
  );
}

const getAttributeFromKey = (key: AvailableFormRelation): AllMocapObjectsTypes | null =>
  Object.keys(DatabaseAttributes).includes(key) ? DatabaseAttributes[key].table as AllMocapObjectsTypes : null;
