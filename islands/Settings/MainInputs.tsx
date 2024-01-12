import { Database } from "@models/database.ts";
import { useState } from "preact/hooks";
import APIInput from "@islands/Settings/Main/APIInput.tsx";
import MiscInput from "@islands/Settings/Main/MiscInput.tsx";

type SettingsMain = Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
type SettingsAPIs = Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type SettingsMisc = Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc];

export default function MainInputs(mainSettings: mainSettings) {
  const [settingsEmails, setSettingsEmails] = useState<SettingsMain>(mainSettings[0]);
  const [settingsAPIs, setSettingsAPIs] = useState<SettingsAPIs>(mainSettings[1]);
  const [settingsMisc, setSettingsMisc] = useState<SettingsMisc>(mainSettings[2]);

  return (
    <>
      <section className={"flex-col justify-center items-start gap-5 inline-flex"}></section>

      <section className={"flex-col justify-center items-start gap-5 inline-flex"}>
        <h1 className={"underline"}>Clés API</h1>
        <APIInput
          title={"Spotify"}
          value={settingsAPIs.api_spotify}
          name={"api_spotify"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
        <APIInput
          title={"Deezer"}
          value={settingsAPIs.api_deezer}
          name={"api_deezer"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
        <APIInput
          title={"Soundcloud"}
          value={settingsAPIs.api_soundcloud}
          name={"api_soundcloud"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
        <APIInput
          title={"Tidal"}
          value={settingsAPIs.api_tidal}
          name={"api_tidal"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
        <APIInput
          title={"Amazon Music"}
          value={settingsAPIs.api_amazon_music}
          name={"api_amazonmusic"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
        <APIInput
          title={"YouTube"}
          value={settingsAPIs.api_youtube_music}
          name={"api_youtube"}
          onUpdate={(data: Record<string, string>) => setSettingsAPIs({ ...settingsAPIs, ...data })}
        />
      </section>

      <section className={"flex-col justify-center items-start gap-5 inline-flex"}>
          <h1>Paramètres généraux du site</h1>

          <MiscInput
            title={"Titre du site"}
            value={settingsMisc.website_title}
            name={"website_title"}
            onUpdate={(data: Record<string, string>) => setSettingsMisc({ ...settingsMisc, ...data })}
          />
          <MiscInput
            title={"Langue"}
            value={settingsMisc.website_language}
            name={"website_language"}
            onUpdate={(data: Record<string, string>) => setSettingsMisc({ ...settingsMisc, ...data })}
          />
          <MiscInput
            title={"URL du site"}
            value={settingsMisc.website_url}
            name={"website_url"}
            onUpdate={(data: Record<string, string>) => setSettingsMisc({ ...settingsMisc, ...data })}
          />
          <MiscInput
            title={"Mots-clés"}
            value={settingsMisc.website_keywords}
            name={"website_keywords"}
            onUpdate={(data: Record<string, string>) => setSettingsMisc({ ...settingsMisc, ...data })}
          />
          <MiscInput
            title={"Icone"}
            value={settingsMisc.website_icone}
            name={"website_icone"}
            onUpdate={(data: Record<string, string>) => setSettingsMisc({ ...settingsMisc, ...data })}
          />
        </section>

    </>
  );
}
