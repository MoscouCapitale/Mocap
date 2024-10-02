import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { FormField } from "@models/Form.ts";

export type FetchableSettingsKeys =
  | "main"
  | "styles"
  | "medias"
  | "misc";

export const FetchableSettingsKeysArray: FetchableSettingsKeys[] = [
  "main",
  "styles",
  "medias",
  "misc",
];

export const getSettings = async (
  field: FetchableSettingsKeys,
): Promise<Record<FormField["name"], string> | null> => {
  console.log("Fetching settings for", field, " from supabase");
  const { data, error } = await supa.from("Settings").select(
    `id, user, ${field}`,
  );

  if (evaluateSupabaseResponse(data, error)) {
    returnErrorReponse(data, error); // Trigger this function for error logging
    return null;
  }

  // @ts-ignore - data is an array of objects
  if (data?.[0]?.[field]) return data[0][field] as Record<FormField["name"], string>
  return null;
};
