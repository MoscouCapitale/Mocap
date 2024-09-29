import BaseInput from "@islands/UI/Forms/Input.tsx";
import { FormField, FormFieldValue } from "@models/Form.ts";
import { useCallback, useMemo, useState } from "preact/hooks";
import {
  MainSettingsDBObject,
  MainSettingsFormFields,
} from "@models/Settings.ts";
import { effect } from "@preact/signals-core";
import { getBaseUrl } from "@utils/pathHandler.ts";
import Button from "@islands/Button.tsx";

type SettingsData = typeof MainSettingsDBObject;

export default function Main() {
  // TODO: I think we can better optimize this (only 1 state needed)
  // Keep the raw data from the database to correctly initialize the form
  const [rawFormData, setRawFormData] = useState<SettingsData>();
  const [formData, setFormData] = useState<SettingsData>();

  effect(() =>
    !rawFormData && fetch(getBaseUrl() + "/api/settings/main")
      .then((res) => res.status === 200 ? res.json() : null)
      .then((fetchedData: SettingsData | null) =>
        setRawFormData(fetchedData ?? MainSettingsDBObject)
      )
  );

  effect(() => rawFormData && !formData && setFormData(rawFormData));

  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);

  const getFieldFromName = (name: FormField["name"]) =>
    MainSettingsFormFields.find((f) => f.name === name);

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
    fetch(getBaseUrl() + "/api/settings/main", {
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
            text={"Sauvegarder"}
            onClick={updateSettings}
            className={{
              wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]",
            }}
          />
        )}
        <form className="flex flex-col gap-14 justify-start">
          {/* Emails */}
          <table className="table-auto border-collapse w-full settings-table">
            <thead>
              <tr>
                <th className="underline text-left">Email sending</th>
                <th className="text-text_grey text-sm text-left">Recipient</th>
                <th className="text-text_grey text-sm text-left">Sender</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Contact</td>
                <td>
                  <Input name="email_contact_recipient" />
                </td>
                <td>
                  <Input name="email_contact_sender" />
                </td>
              </tr>
              <tr>
                <td>Admin</td>
                <td>
                  <Input name="email_admin_recipient" />
                </td>
                <td>
                  <Input name="email_admin_sender" />
                </td>
              </tr>
              <tr>
                <td>Logging</td>
                <td>
                  <Input name="email_logging_recipient" />
                </td>
                <td>
                  <Input name="email_logging_sender" />
                </td>
              </tr>
              <tr>
                <td>User creation</td>
                <td>
                  <Input name="email_usercreate_recipient" />
                </td>
                <td>
                  <Input name="email_usercreate_sender" />
                </td>
              </tr>
              <tr>
                <td>Default</td>
                <td>
                  <Input name="email_default_sender" />
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* APIs keys */}
          <table className="table-auto border-collapse settings-table">
            <thead>
              <tr>
                <th className="underline text-left" colSpan={2}>API keys</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spotify</td>
                <td>
                  <Input name="api_spotify" />
                </td>
              </tr>
              <tr>
                <td>Soundcloud</td>
                <td>
                  <Input name="api_soundcloud" />
                </td>
              </tr>
              <tr>
                <td>Deezer</td>
                <td>
                  <Input name="api_deezer" />
                </td>
              </tr>
              <tr>
                <td>YouTube Music</td>
                <td>
                  <Input name="api_youtube_music" />
                </td>
              </tr>
              <tr>
                <td>Amazon Music</td>
                <td>
                  <Input name="api_amazon_music" />
                </td>
              </tr>
              <tr>
                <td>Tidal</td>
                <td>
                  <Input name="api_tidal" />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Misc */}
          <table className="table-auto border-collapse settings-table">
            <thead>
              <tr>
                <th className="underline text-left" colSpan={2}>
                  Main app settings
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Website title</td>
                <td>
                  <Input name="website_title" />
                </td>
              </tr>
              <tr>
                <td>Website URL</td>
                <td>
                  <Input name="website_url" />
                </td>
              </tr>
              <tr>
                <td>Icon</td>
                <td>
                  <Input name="website_icon" />
                </td>
              </tr>
              <tr>
                <td>
                  <p>
                    Keywords{" "}
                    <span className={"text-sm text-text_grey"}>
                      (separated by ;)
                    </span>
                  </p>
                </td>
                <td>
                  <Input name="website_keywords" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </>
    )
    : null;
}
