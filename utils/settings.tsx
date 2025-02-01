import { Toast } from "@hooks/toast.tsx";
import { Input } from "@islands/UI";
import { FormField } from "@models/Form.ts";
import { FetchableSettingsKeys, FetchableSettingsKeysArray, getSettingsFieldsFromName } from "@models/forms/Settings.ts";
import { supabase as supa } from "@services/supabase.ts";

/**
 * Fetches settings input component based on the provided settings type.
 *
 * @param {FetchableSettingsKeys} type - The type of settings to fetch.
 * @returns {Promise<React.FC<{ name: FormField["name"] }>>} - A promise that resolves to a React functional component.
 *
 * The returned component renders an input field based on the fetched settings data.
 * If the provided type is invalid or if there is an error fetching the settings,
 * an empty component is returned.
 *
 * The component uses the `BaseInput` component to render the input field.
 * The `BaseInput` component retrieves the field details by name and sets the default value
 * from the fetched settings data.
 *
 * @example
 * ```tsx
 * const SettingsInput = await getSettingsInput("someSettingType");
 * return <SettingsInput name="someFieldName" />;
 * ```
 */
export const getSettingsInput = async (type: FetchableSettingsKeys): Promise<React.FC<{ name: FormField["name"] }>> => {
  if (!FetchableSettingsKeysArray.includes(type)) {
    console.error("Invalid settings type in getSettingsInput for settings: ", type);
    return () => <></>; // Return an empty component
  }

  const { data, error } = await supa.from("Settings").select(`id, user, ${type}`);

  // Handle errors or empty data
  if (!data || data.length === 0 || error) {
    console.error("Failed to fetch settings:", error);
    return () => <></>;
  }

  // Assuming data[0][type] contains the form data
  const rawFormData = data[0][type];
  if (!rawFormData) console.error("No form data found for settings: ", type, ". Not rendering any fields.");

  // Function to get field details by name
  const getFieldFromName = (name: FormField["name"]) => getSettingsFieldsFromName(type).find((f) => f.name === name);

  // Define the BaseInput component
  const BaseInput: React.FC<{ name: FormField["name"] }> = ({ name }) => {
    const field = getFieldFromName(name);
    if (!field || !rawFormData) return <></>;
    let defaultValue = rawFormData[name] ?? "";
    try {
      defaultValue = JSON.parse(defaultValue);
    } catch (_) {
      // Do nothing
    }
    return (
      <Input
        field={{
          defaultValue,
          ...field,
        }}
      />
    );
  };

  return BaseInput;
};

/**
 * Handles the POST request for updating settings.
 *
 * @param req - The request object containing form data.
 * @param type - The type of settings to be fetched, must be a valid key from FetchableSettingsKeys.
 * @returns A promise that resolves to a Toast object indicating the result of the operation.
 *
 * The function performs the following steps:
 * 1. Validates the settings type.
 * 2. Extracts form data from the request.
 * 3. Validates the form fields against expected fields for the given settings type.
 * 4. Handles special case for "website_icon" field which is a file:
 *    - Uploads the file to storage.
 *    - Updates the "Medias" table with the file information.
 *    - Replaces the form data for "website_icon" with the file metadata.
 * 5. Constructs the body for the settings update.
 * 6. Upserts the settings into the "Settings" table.
 * 7. Returns a success or error toast message based on the operation result.
 *
 * @throws Will throw an error if there is an issue during the settings update process.
 */
export const settingPostHandler = async (req: Request, type: FetchableSettingsKeys): Promise<Toast> => {
  if (!FetchableSettingsKeysArray.includes(type)) {
    console.error("Invalid settings type in settingPostHandler for settings: ", type);
    return { title: "Erreur", description: "Une erreur est survenue lors de la sauvegarde des paramètres. Merci de réessayer." };
  }

  const formDatas = await req.formData();

  // First check that the datas are in the expected form fields
  const expectedFormFields = getSettingsFieldsFromName(type);
  const formFieldNames = expectedFormFields.map((f) => f.name);

  if (Object.keys(formDatas).some((k) => !formFieldNames.includes(k))) {
    console.error("Invalid form fields in settingPostHandler for settings: ", type);
    return { title: "Erreur", description: "Une erreur est survenue lors de la sauvegarde des paramètres. Merci de réessayer." };
  }

  try {
    // Special handler for input "website_icon", that is a file
    const websiteIcon = formDatas.get("website_icon") as File;
    if (websiteIcon instanceof File) {
      // upsert the file in storage
      await supa.storage.from("Images").upload("website_icon", websiteIcon, { upsert: true });
      const publicUrl = await supa.storage.from("Images").getPublicUrl("website_icon");

      // upsert the entry in medias table, based on the name
      const iconEntry = await supa
        .from("Medias")
        .upsert(
          {
            id: "34c7b081-6672-4e31-8b72-8fb111a0a1da", // Hardcoded ID. Hope it's not a problem
            name: "website_icon",
            display_name: "Website Icon",
            public_src: publicUrl.data.publicUrl,
            alt: "Website Icon",
            type: "Images",
            filesize: websiteIcon.size,
            updated_at: new Date().toISOString(),
            extension: websiteIcon.type,
          },
          { onConflict: ["name"] }
        )
        .select("public_src, type, name");
      if (iconEntry.data && iconEntry.data[0].public_src) {
        formDatas.set("website_icon", JSON.stringify(iconEntry.data[0]));
      }
      // Only accept files, otherwise delete the field to avoid any issue
    } else if (typeof websiteIcon !== "string") formDatas.delete("website_icon");

    // Special handler for input "terms_file", that is a file
    const termsFile = formDatas.get("terms_file") as File;
    if (termsFile instanceof File) {
      // upsert the file in storage
      await supa.storage.from("Misc").upload("terms_file", termsFile, { upsert: true });
      const publicUrl = await supa.storage.from("Misc").getPublicUrl("terms_file");

      // upsert the entry in medias table, based on the name
      const termsEntry = await supa
        .from("Medias")
        .upsert(
          {
            id: "aeb35b13-1d70-4a4e-9de0-c4cd4690412e", // Hardcoded ID. Hope it's not a problem
            name: "terms_file",
            display_name: "Terms File",
            public_src: publicUrl.data.publicUrl,
            alt: "Terms File",
            type: "Misc",
            filesize: termsFile.size,
            updated_at: new Date().toISOString(),
            extension: termsFile.type,
          },
          { onConflict: ["name"] }
        )
        .select("public_src, type, name, extension");
      if (termsEntry.data && termsEntry.data[0].public_src) {
        formDatas.set("terms_file", JSON.stringify(termsEntry.data[0]));
      }
      // Only accept files, otherwise delete the field to avoid any issue
    } else if (typeof termsFile !== "string") formDatas.delete("terms_file");

    // FIXME: hadrcode id to 0. For now we'll only support "general" settings, but it will change with settings by-users
    const body = {
      id: 0,
      updated_at: new Date().toISOString(),
      [type]: formFieldNames.reduce((acc, name) => {
        acc[name] = String(formDatas.get(name) ?? "");
        return acc;
      }, {} as Record<string, string>),
    };

    const { error } = await supa.from("Settings").upsert(body);
    if (error) throw error;
    return { description: "Les paramètres ont bien été sauvegardés." };
  } catch (e) {
    console.error("Error while saving main settings: ", e);
    return { title: "Erreur", description: "Une erreur est survenue lors de la sauvegarde des paramètres. Merci de réessayer." };
  }
};
