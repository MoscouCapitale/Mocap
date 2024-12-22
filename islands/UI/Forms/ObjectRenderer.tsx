import { Artist, AudioBrick, availBricks, BricksType, Platform, Track } from "@models/Bricks.ts";
import { MediaControls, MediaCTA } from "@models/Medias.ts";
import { AllMocapObjectsTypes, getObjectFormFromType } from "@models/forms/bricks.tsx";
import { useEffect, useMemo, useState } from "preact/hooks";
import ContentForm from "./ContentForm.tsx";
import { ContentFormValue } from "./ContentForm.tsx";
import { FormField } from "@models/Form.ts";
import { set } from "lodash";

type SupportedObjects = availBricks | Track | Platform | MediaCTA | MediaControls | Artist | AudioBrick;

type ObjectRendererProps = {
  /** The type of the element to the form be rendered */
  type: AllMocapObjectsTypes;
  /** The current content of the object. It NEEDS to have all fields, even empty. */
  content?: SupportedObjects;
  /** Function returned with the new object when a field changes */
  onChange?: (obj: SupportedObjects) => void;
};

// TODO: for perf change on blur ?

/**
 * Render the full form of an object.
 *
 * Support main elements (ex. Bricks), but also the secondary one (platforms, track, cta, etc...)
 *
 * @param param0
 * @returns
 */
export default function ObjectRenderer({ type, content, onChange }: ObjectRendererProps) {
  const form = useMemo(() => getObjectFormFromType(type), [type]);
  // Do no set content as a dependency, as it will cause a re-render on each event (if content is set)
  const initialData = useMemo(() => content ?? createEmptyObject(form), [form, content]);

  const [data, setDatas] = useState<SupportedObjects | null>();

  if (!form || !initialData) {
    console.error("Error while trying to rendering object for ", type);
    return null;
  }

  useEffect(() => {
    if (onChange && data) onChange(data);
  }, [data]);

  return (
    <div class="flex flex-col gap-6 flex-wrap">
      <ContentForm form={form} initialData={initialData as ContentFormValue} setDatas={setDatas as unknown as (value: ContentFormValue) => void} />
    </div>
  );
}

/** Create an empty object from the given type */
function createEmptyObject(form: FormField[] | null): Omit<SupportedObjects, "id"> | null {
  if (!form) return null;
  const res = {};

  // Get the default value for each field. Either get the default value or create an empty one
  const getFieldValue = (field: FormField) => {
    switch (field.type) {
      case "number":
        return field.defaultValue ?? 0;
      case "checkbox":
        return field.defaultValue ?? false;
      case "select":
        return field.defaultValue ?? "";
      case "multiselect":
        return field.defaultValue ?? [];
      case "file":
        return field.defaultValue ?? null;
      case "relation":
        return field.relation?.multiple ? [] : {};
      case "markdown":
      case "date":
      case "color":
      case "email":
      case "password":
      case "NI":
      case "string":
        return field.defaultValue ?? "";
    }
  }

  form.forEach((field) => set(res, field.name, getFieldValue(field)));

  return res;
}
