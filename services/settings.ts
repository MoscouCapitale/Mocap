import { supabase as supa } from "@services/supabase.ts";
import { MainSettingsDBObject } from "@models/Settings.ts";

export type FetchableSettingsKeys =
  | "main"
  | "styles"
  | "medias"
  | "misc";

export const FetchableSettingsKeysArray: FetchableSettingsKeys[] = ["main", "styles", "medias", "misc"];


export const getSettings = async (
  field: FetchableSettingsKeys,
): Promise<typeof MainSettingsDBObject> => {
  const res = await supa.from("Settings").select(`id, user, ${field}`);
  // FIXME: add correct supâbase error manager
  return res.data;
};
