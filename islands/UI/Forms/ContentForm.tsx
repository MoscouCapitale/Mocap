import { Input } from "@islands/UI";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { get, set } from "lodash";
import { useState } from "preact/hooks";

export type ContentFormValue = { [key: FormField["name"]]: FormFieldValue };

type ContentFormProps = {
  form: FormField[];
  setDatas?: (value: ContentFormValue) => void;
};

/** Render a formField array. All formField default values must be set. */
export default function ContentForm({ form, setDatas }: ContentFormProps) {
  const [formData, setFormData] = useState(
    form.reduce((acc, field) => {
      set(acc, field.name, field.defaultValue);
      return acc;
    }, {} as ContentFormValue),
  );

  const onValueChange = (value: FormFieldValue, name: FormField["name"]) => {
    setFormData((prev) => {
      const newVal = { ...prev };
      set(newVal, name, value);
      if (setDatas) setDatas(newVal);
      return newVal;
    });
  };

  const renderField = (f: FormField) => (f.trigger ? f.trigger.fieldName.some((n) => f.trigger?.condition(get(formData, n))) : !f.hidden);

  // TODO: add media support
  return <>{form.map((field) => (renderField(field) ? <Input key={field.name} field={field} onChange={(v) => onValueChange(v, field.name)} /> : null))}</>;
}
