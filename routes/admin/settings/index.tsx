// TODO: redo all this shit

import { retrieveMain } from "@services/settings.ts";
import { effect, useSignal } from "@preact/signals";
import { Database } from "@models/database.ts";

import Index from "@islands/Settings/Main/Index.tsx";

type MainSettings = {
  api_amazon_music: string | null;
  api_deezer: string | null;
  api_soundcloud: string | null;
  api_spotify: string | null;
  api_tidal: string | null;
  api_youtube_music: string | null;
  email_administrator: Email;
  email_contact: Email;
  email_default_sender: string;
  email_logging: Email;
  email_user_creator: Email;
  website_icone: number | null;
  website_keywords: string | null;
  website_language: number;
  website_title: string | null;
  website_url: string;
};

type Email = Database["public"]["Tables"]["Mail_Pairing"]["Row"];

const defaultEmail = {
  id: 0,
  email_recipient: "",
  email_sender: "",
};

const defautltSettings = {
  api_amazon_music: "",
  api_deezer: "",
  api_soundcloud: "",
  api_spotify: "",
  api_tidal: "",
  api_youtube_music: "",
  email_administrator: defaultEmail,
  email_contact: defaultEmail,
  email_default_sender: "",
  email_logging: defaultEmail,
  email_user_creator: defaultEmail,
  website_icone: null,
  website_keywords: "",
  website_language: 0,
  website_title: "",
  website_url: "",
};

export default function Settings() {
  const settings = useSignal<MainSettings>(defautltSettings);

  retrieveMain()
    .then((data) => {
      if (data && data.length !== 0) settings.value = data[0];
    })
    .catch((err) => {
      console.error(err);
    });

  return (
    <Index settings={settings.value} />
  );
}
