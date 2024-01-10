import { useEffect, useState } from "preact/hooks";

import EmailMatrix from "@islands/Settings/Main/EmailMatrix.tsx";
import APIInput from "@islands/Settings/Main/APIInput.tsx";
import MiscInput from "@islands/Settings/Main/MiscInput.tsx";

export default function Index(props: { settings: any }) {
  const [baseSettings] = useState(props.settings);
  const [settings, setSettings] = useState(baseSettings);
  const [save, setSave] = useState(false);

  useEffect(() => {
    if (settings !== baseSettings) setSave(true);
  }, [settings]);

  return (
    <>
      <main className={"flex-col justify-center items-start gap-14 inline-flex"}>
        <section className={"flex-col justify-center items-start gap-5 inline-flex"}>
          <EmailMatrix
            data={{
              email_administrator: settings.email_administrator,
              email_contact: settings.email_contact,
              email_default_sender: settings.email_default_sender,
              email_logging: settings.email_logging,
              email_user_creator: settings.email_user_creator,
            }}
            onUpdate={(data: Record<string, any>) => setSettings({ ...settings, ...data })}
          />
        </section>

        <section className={"flex-col justify-center items-start gap-5 inline-flex"}>
          <h1 className={"underline"}>Clés API</h1>

          <APIInput
            title={"Spotify"}
            value={settings.api_spotify}
            name={"api_spotify"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <APIInput
            title={"Deezer"}
            value={settings.api_deezer}
            name={"api_deezer"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <APIInput
            title={"Soundcloud"}
            value={settings.api_soundcloud}
            name={"api_soundcloud"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <APIInput
            title={"Tidal"}
            value={settings.api_tidal}
            name={"api_tidal"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <APIInput
            title={"Amazon Music"}
            value={settings.api_amazon_music}
            name={"api_amazon_music"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <APIInput
            title={"Youtube Music"}
            value={settings.api_youtube_music}
            name={"api_youtube_music"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
        </section>

        <section className={"flex-col justify-center items-start gap-5 inline-flex"}>
          <h1>Paramètres généraux du site</h1>

          <MiscInput
            title={"Titre du site"}
            value={settings.website_title}
            name={"website_title"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <MiscInput
            title={"Langue"}
            value={settings.website_language}
            name={"website_language"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <MiscInput
            title={"URL du site"}
            value={settings.website_url}
            name={"website_url"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <MiscInput
            title={"Mots-clés"}
            value={settings.website_keywords}
            name={"website_keywords"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
          <MiscInput
            title={"Icone"}
            value={settings.website_icone}
            name={"website_icone"}
            onUpdate={(data: Record<string, string>) => setSettings({ ...settings, ...data })}
          />
        </section>
      </main>

      {save && (
        <button
          className={
            "px-1.5 py-1 rounded text-text border border-text_grey justify-start items-center gap-2.5 inline-flex bg-background focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
          }
          onClick={() => setSave(false)}
        >
          Sauvegarder
        </button>
      )}
    </>
  );
}
