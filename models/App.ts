import { Database } from "@models/database.ts";

interface AppStorage {
  navbarCollapsed?: boolean;
}

type Modify<T, R> = Omit<T, keyof R> & R;

type Default_SettingsMain = Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
type SettingsMain = Modify<
  Default_SettingsMain,
  {
    email_contact: {
      email_recipient: string;
      email_sender: string;
    };
    email_administrator: {
      email_recipient: string;
      email_sender: string;
    };
    email_logging: {
      email_recipient: string;
      email_sender: string;
    };
    email_user_creator: {
      email_recipient: string;
      email_sender: string;
    };
  }
>;
type SettingsAPIs = Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type Default_SettingsMisc = Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];
type SettingsMisc = Modify<
  Default_SettingsMisc,
  {
    website_language: 'fr' | 'en';
  }>;

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc];

type mediasSettings = Database["public"]["Tables"]["Website_Settings_Medias"]["Row"];

type stylesSettings = Database["public"]["Tables"]["Website_Settings_Styles"]["Row"];

type miscSettings = Database["public"]["Tables"]["Website_Settings_Misc"]["Row"];


export type { AppStorage, mainSettings, mediasSettings, stylesSettings, miscSettings };