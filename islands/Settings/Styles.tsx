import { Input as BaseInput } from "@islands/UI";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { useCallback, useMemo, useState } from "preact/hooks";
import {
  StylesSettingsDBObject,
  StylesSettingsFormFields,
} from "@models/Settings.ts";
import { effect } from "@preact/signals-core";
import { getBaseUrl } from "@utils/pathHandler.ts";
import Button from "../UI/Button.tsx";

type SettingsData = typeof StylesSettingsDBObject;

export default function Styles() {
  // TODO: I think we can better optimize this (only 1 state needed)
  // Keep the raw data from the database to correctly initialize the form
  const [rawFormData, setRawFormData] = useState<SettingsData>();
  const [formData, setFormData] = useState<SettingsData>();

  effect(() =>
    !rawFormData && fetch(getBaseUrl() + "/api/settings/styles")
      .then((res) => res.status === 200 ? res.json() : null)
      .then((fetchedData: SettingsData | null) =>
        setRawFormData(fetchedData ?? StylesSettingsDBObject)
      )
  );

  effect(() => rawFormData && !formData && setFormData(rawFormData));

  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  const getFieldFromName = (name: FormField["name"]) =>
    StylesSettingsFormFields.find((f) => f.name === name);

  const onValueChange = useCallback(
    (value: FormFieldValue, name: FormField["name"]) => {
      if (rawFormData && Object.keys(rawFormData).includes(name)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        if (!showSaveButton) setShowSaveButton(true);
      }
    },
    [rawFormData],
  );

  // TODO: add toast when canvas features are ready
  const updateSettings = useCallback(() => {
    fetch(getBaseUrl() + "/api/settings/styles", {
      method: "POST",
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.status === 200) setShowSaveButton(false);
    });
  }, [formData]);

  const Input = useCallback(({ name }: { name: FormField["name"] }) => {
    const field = getFieldFromName(name);
    if (!field || !rawFormData) return <></>;
    return (
      <BaseInput
        field={{
          defaultValue: rawFormData[name] ?? "",
          ...field,
        }}
        onChange={(v) => onValueChange(v, field.name)}
      />
    );
  }, [rawFormData]);

  return rawFormData
    ? (
      <>
        {showSaveButton && (
          <Button
            onClick={updateSettings}
            className={{
              wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]",
            }}
          >Sauvegarder</Button>
        )}
        <form className="flex flex-col gap-14 justify-start">
          {/* Colors */}
          <table className="table-auto border-collapse settings-table">
            <thead>
              <tr>
                <th className="underline text-left" colSpan={2}>
                  Colors
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>Auto colors management</p>
                </td>
                <td>
                  <Input name="style_color_auto" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Main color</p>
                </td>
                <td>
                  <Input name="style_color_main" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Secondary color</p>
                </td>
                <td>
                  <Input name="style_color_secondary" />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Fonts */}
          <table className="table-auto border-collapse settings-table">
            <thead>
              <tr>
                <th className="underline text-left" colSpan={2}>
                  Fonts
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>Main font</p>
                </td>
                <td>
                  <Input name="style_font_main" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Secondary font</p>
                </td>
                <td>
                  <Input name="style_font_secondary" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </>
    )
    : null;
}
