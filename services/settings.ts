import { supabase as sup } from "@services/supabase.ts";
import { Database } from "@models/database.ts";

type SettingsMain =
  Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
type SettingsAPIs =
  Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type SettingsMisc =
  Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc];

const defaultSettings: mainSettings = [
  {
    id: 1,
    email_administrator: 0,
    email_contact: 0,
    email_default_sender: "",
    email_logging: 0,
    email_user_creator: 0,
    created_at: "",
    modified_at: "",
  },
  {
    id: 1,
    api_amazon_music: "",
    api_deezer: "",
    api_soundcloud: "",
    api_spotify: "",
    api_tidal: "",
    api_youtube_music: "",
    created_at: "",
    modified_at: "",
  },
  {
    id: 1,
    website_icone: 0,
    website_keywords: "",
    website_language: 0,
    website_title: "",
    website_url: "",
    created_at: "",
    modified_at: "",
  },
];

const retrieveMain = async (): Promise<mainSettings> => {
  const email = await sup.from("Website_Settings_Main_Emails").select();
  if (email.data.length === 0) email.data = defaultSettings[0];
  const api = await sup.from("Website_Settings_Main_APIs").select();
  if (api.data.length === 0) api.data = defaultSettings[1];
  const misc = await sup.from("Website_Settings_Main_Misc").select();
  if (misc.data.length === 0) misc.data = defaultSettings[2];
  return [email.data, api.data, misc.data];
};

export { retrieveMain };
