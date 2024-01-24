import { useEffect, useState } from "preact/hooks";
import { mainSettings } from "@models/App.ts";
import { JSX } from "preact/jsx-runtime";
import InlineSingleInput from "@islands/Settings/SettingsChilds/InlineSingleInput.tsx";
import InlineDoubleInput from "@islands/Settings/SettingsChilds/InlineDoubleInput.tsx";
import Button from "@islands/Button.tsx";

export default function MainSettings() {
  const [emails, setEmails] = useState<mainSettings[0] | null>(null);
  const [apis, setAPIs] = useState<mainSettings[1] | null>(null);
  const [misc, setMisc] = useState<mainSettings[2] | null>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [defaultSettings, setDefaultSettings] = useState<mainSettings | null>(null);

  useEffect(() => {
    if (emails !== null && apis !== null && misc !== null) {
      if (defaultSettings === null) setDefaultSettings([emails, apis, misc]);
      if (defaultSettings?.[0] !== emails || defaultSettings?.[1] !== apis || defaultSettings?.[2] !== misc) setModified(true);
      else setModified(false);
    }
    if (emails === null && apis === null && misc === null) {
      fetchEmails();
      fetchAPIs();
      fetchMisc();
    }
  }, [emails, apis, misc]);

  useEffect(() => {
    console.log("modified", modified);
  }, [modified]);

  const fetchEmails = () => {
    fetch("/api/settings/main/emails", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0]);
        setEmails(data[0] ?? {});
      });
  };

  const fetchAPIs = () => {
    fetch("/api/settings/main/apis", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAPIs(data[0] ?? {});
      });
  };

  const fetchMisc = () => {
    fetch("/api/settings/main/general", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setMisc(data[0] ?? {});
      });
  };

  const testApiButton = (api: string): JSX.Element => {
    return <button onClick={() => testApi(api)}>Test</button>;
  };

  const testApi = (api: string) => {
    return;
  };

  const updateSettings = (): void => {
    fetch("/api/settings/main/emails", {
      method: "PUT",
      body: JSON.stringify({
        emails
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('post result of emails', data);
      });

    fetch("/api/settings/main/apis", {
      method: "PUT",
      body: JSON.stringify({
        apis
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('post result of apis', data);
      });

    fetch("/api/settings/main/general", {
      method: "PUT",
      body: JSON.stringify({
        misc
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('post result of misc', data);
      });

      // TODO: add a toast to confirm the update
      // TODO: add a toast component
  }

  return (
    <>
      {modified && (
        <Button text={"Sauvegarder"} onClick={updateSettings} className={{ wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]" }} />
      )}
      {emails && apis && misc && (
        <>
          <section className={`flex-col justify-center items-start gap-5 inline-flex`}>
            <InlineDoubleInput
              label={"Envoi mails"}
              value_first={"Correspondant"}
              onChange_first={() => {}}
              value_second={"Expéditeur"}
              onChange_second={() => {}}
              // TODO: fix visible border with tailwind
              className={{ label: "w-[200px]", input_first: "w-[200px] border-0 text-text_grey", input_second: "w-[200px] border-0 text-text_grey" }}
            />

            <section className={`flex-col justify-start items-center gap-2.5 inline-flex`}>
              <InlineDoubleInput
                label={"Contact"}
                value_first={emails.email_contact?.email_recipient ?? ""}
                onChange_first={(value) => setEmails({ ...emails, email_contact: { ...emails.email_contact, email_recipient: value } })}
                value_second={emails.email_contact?.email_sender ?? ""}
                onChange_second={(value) => setEmails({ ...emails, email_contact: { ...emails.email_contact, email_sender: value } })}
                className={{ label: "w-[200px]", input_first: "w-[200px]", input_second: "w-[200px]" }}
              />
              <InlineDoubleInput
                label={"Administrateur"}
                value_first={emails.email_administrator?.email_recipient ?? ""}
                onChange_first={(value) => setEmails({ ...emails, email_administrator: { ...emails.email_administrator, email_recipient: value } })}
                value_second={emails.email_administrator?.email_sender ?? ""}
                onChange_second={(value) => setEmails({ ...emails, email_administrator: { ...emails.email_administrator, email_sender: value } })}
                className={{ label: "w-[200px]", input_first: "w-[200px]", input_second: "w-[200px]" }}
              />

              <InlineDoubleInput
                label={"Logging"}
                value_first={emails.email_logging?.email_recipient ?? ""}
                onChange_first={(value) => setEmails({ ...emails, email_logging: { ...emails.email_logging, email_recipient: value } })}
                value_second={emails.email_logging?.email_sender ?? ""}
                onChange_second={(value) => setEmails({ ...emails, email_logging: { ...emails.email_logging, email_sender: value } })}
                className={{ label: "w-[200px]", input_first: "w-[200px]", input_second: "w-[200px]" }}
              />

              <InlineDoubleInput
                label={"Création utilisateur"}
                value_first={emails.email_user_creator?.email_recipient ?? ""}
                onChange_first={(value) => setEmails({ ...emails, email_user_creator: { ...emails.email_user_creator, email_recipient: value } })}
                value_second={emails.email_user_creator?.email_sender ?? ""}
                onChange_second={(value) => setEmails({ ...emails, email_user_creator: { ...emails.email_user_creator, email_sender: value } })}
                className={{ label: "w-[200px]", input_first: "w-[200px]", input_second: "w-[200px]" }}
              />
            </section>

            <InlineSingleInput
              value={emails.email_default_sender ?? ""}
              onChange={(value) => setEmails({ ...emails, email_default_sender: value })}
              label={"Adresse mail d'envoi par défaut"}
              type={"text"}
              className={{ input: "w-[250px]" }}
            />
          </section>

          <section className={`flex-col justify-center items-start gap-5 inline-flex`}>
            <p className={"underline"}>Clés API</p>

            <InlineSingleInput
              value={apis.api_spotify ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_spotify: value })}
              label={"Spotify"}
              type={"text"}
              addedButton={testApiButton("api_spotify")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={apis.api_soundcloud ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_soundcloud: value })}
              label={"Soundcloud"}
              type={"text"}
              addedButton={testApiButton("api_soundcloud")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={apis.api_deezer ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_deezer: value })}
              label={"Deezer"}
              type={"text"}
              addedButton={testApiButton("api_deezer")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={apis.api_youtube_music ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_youtube_music: value })}
              label={"Youtube Music"}
              type={"text"}
              addedButton={testApiButton("api_youtube_music")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={apis.api_amazon_music ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_amazon_music: value })}
              label={"Amazon Music"}
              type={"text"}
              addedButton={testApiButton("api_amazon_music")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={apis.api_tidal ?? ""}
              onChange={(value) => setAPIs({ ...apis, api_tidal: value })}
              label={"Tidal"}
              type={"text"}
              addedButton={testApiButton("api_tidal")}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />
          </section>

          <section className={`flex-col justify-center items-start gap-5 inline-flex`}>
            <p className={"underline"}>Paramètres généraux du site</p>
            <InlineSingleInput
              value={misc.website_title ?? ""}
              onChange={(value) => setMisc({ ...misc, website_title: value })}
              label={"Titre"}
              type={"text"}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={misc.website_url ?? ""}
              onChange={(value) => setMisc({ ...misc, website_url: value })}
              label={"URL du site"}
              type={"text"}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={misc.website_icon ?? ""}
              onChange={(value) => setMisc({ ...misc, website_icon: parseInt(value) })}
              label={"Icon"}
              type={"file"}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            <InlineSingleInput
              value={misc.website_keywords ?? ""}
              onChange={(value) => setMisc({ ...misc, website_keywords: value })}
              label={"Mot-clés"}
              type={"text"}
              className={{ label: "w-[200px]", input: "w-[250px]" }}
            />

            {/* TODO: website language & internationalization */}

          </section>
        </>
      )}
    </>
  );
}
