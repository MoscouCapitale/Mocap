import { FormField, FormFieldOptions, FormFieldValue, isFormFieldOption, RelationFormField, SelectField } from "@models/Form.ts";
import { getObjectFormFromType } from "@models/forms/bricks.tsx";
import { useEffect, useMemo, useState } from "preact/hooks";
import ContentForm, { ContentFormValue } from "./ContentForm.tsx";
import { IBrick } from "@models/Bricks.ts";
import { AvailableAttributes } from "./RelationInput/relationManager.ts";
import { get, merge } from "lodash";

type AcceptedTypes = Parameters<typeof getObjectFormFromType>[0];

type ObjectRendererProps<T extends AcceptedTypes> = {
  /** The type of the element to the form be rendered */
  type: T;
  content?: IBrick | AvailableAttributes;
  /** Function returned with the new object when a field changes */
  onChange?: (obj: unknown) => void;
  /** Function that will return true is the current form state is valid */
  validateForm?: () => boolean;
};

/**
 * Render the full form of an object.
 *
 * Support main elements (ex. Bricks), but also the secondary one (platforms, track, cta, etc...)
 *
 * @param param0
 * @returns
 */
export default function ObjectRenderer({ type, content, onChange, validateForm: _ }: ObjectRendererProps<AcceptedTypes>) {
  const form: FormField[] = useMemo(
    () => [
      { name: "id", defaultValue: content?.id, hidden: true, type: "string" },
      ...getObjectFormFromType(type).map((f) => ({
        ...f,
        defaultValue: getFieldValue(f, content),
      })),
    ],
    [type, content?.id],
  );

  const [data, setDatas] = useState<ContentFormValue>(content ?? {});

  useEffect(() => {
    if (onChange && data) onChange(data);
  }, [data]);

  /** Assign validateForm var to the field, to let the parent call it  */
  _ = () => validateFields(form, data);

  return (
    <div class="flex flex-col gap-6 flex-wrap">
      <ContentForm key={content?.id} form={form} setDatas={(d) => setDatas((p) => parseUpdatedValue(p, d))} />
    </div>
  );
}

const getFieldValue = (field: FormField, form?: { [k: string]: FormFieldValue }) => {
  const value = get(form ?? {}, field.name) ?? field.defaultValue;

  switch (field.type) {
    case "number": {
      if (!isNaN(Number(value))) return Number(value);
      return 0;
    }
    case "checkbox": {
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      return undefined;
    }
    case "file":
      return value ?? null;
    case "select":
    case "relation": {
      const parseValue = (v?: { name?: string; title?: string; id?: string }): FormFieldOptions | undefined => {
        if (!v) return undefined;
        return isFormFieldOption(v) ? v : { value: v, label: v.name ?? v.title ?? v.id ?? v };
      };
      if ((field as SelectField).multiple || (field as RelationFormField).relation?.multiple) return [value].flat().map(parseValue).filter(Boolean);
      return parseValue(value);
    }
    case "markdown":
    case "date":
    case "color":
    case "email":
    case "password":
    case "NI":
    case "string":
      return value ?? "";
  }
};

const validateFields = (fields: FormField[], datas: ContentFormValue) =>
  !!fields.find((field) => {
    const value = get(datas, field.name);
    if (field.required) return typeof value === "string" ? value === "" : value === undefined;
    if (field.validation) return !field.validation(value);
    return false;
  });

const parseUpdatedValue = (prevValue: ContentFormValue, newValue: ContentFormValue) => {
  const value = Object.entries(newValue).reduce((acc, [k, v]) => {
    let parsed = v;
    if (isFormFieldOption(parsed)) parsed = parsed.value;
    if (Array.isArray(parsed)) parsed = parsed.map((p) => (isFormFieldOption(p) ? p.value : p));

    acc[k] = parsed;
    return acc;
  }, {} as ContentFormValue);

  return merge(prevValue, value);
};
