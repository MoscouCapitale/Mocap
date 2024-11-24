import { Input as BaseInput } from "@islands/UI";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { useCallback, useMemo, useState } from "preact/hooks";
import {
  MediasSettingsDBObject,
  MediasSettingsFormFields,
} from "@models/Settings.ts";
import { effect } from "@preact/signals-core";
import { getBaseUrl } from "@utils/pathHandler.ts";
import Button from "../UI/Button.tsx";

type SettingsData = typeof MediasSettingsDBObject;

export default function Medias() {
  // TODO: I think we can better optimize this (only 1 state needed)
  // Keep the raw data from the database to correctly initialize the form
  const [rawFormData, setRawFormData] = useState<SettingsData>();
  const [formData, setFormData] = useState<SettingsData>();

  effect(() =>
    !rawFormData && fetch(getBaseUrl() + "/api/settings/medias")
      .then((res) => res.status === 200 ? res.json() : null)
      .then((fetchedData: SettingsData | null) =>
        setRawFormData(fetchedData ?? MediasSettingsDBObject)
      )
  );

  effect(() => rawFormData && !formData && setFormData(rawFormData));

  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  const getFieldFromName = (name: FormField["name"]) =>
    MediasSettingsFormFields.find((f) => f.name === name);

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
    fetch(getBaseUrl() + "/api/settings/medias", {
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
          <table className="table-auto border-collapse settings-table">
            <thead>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>
                    Max medias size{" "}
                    <span className={"text-sm text-text_grey"}>
                      (mb)
                    </span>
                  </p>
                </td>
                <td>
                  <Input name="media_max_size_mb" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Max medias size{" "}
                    <span className={"text-sm text-text_grey"}>
                      (height / width)
                    </span>
                  </p>
                </td>
                <td>
                  <Input name="media_max_size_height" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Auto quality management{" "}
                    <span className={"text-sm text-text_grey"}>
                      (recommended)
                    </span>
                  </p>
                </td>
                <td>
                  <Input name="media_auto_optimize" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Lazy loading{" "}
                    <span className={"text-sm text-text_grey"}>
                      (recommended)
                    </span>
                  </p>
                </td>
                <td>
                  <Input name="media_lazyload" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </>
    )
    : null;
}
