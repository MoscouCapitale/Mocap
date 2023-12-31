import { retrieveMain } from "@services/settings.ts";
import { useSignal } from "@preact/signals";

type MainSettings = {
  api_amazon_music: string | null;
  api_deezer: string | null;
  api_soundcloud: string | null;
  api_spotify: string | null;
  api_tidal: string | null;
  api_youtube_music: string | null;
  email_administrator: number;
  email_contact: number;
  email_default_sender: string;
  email_logging: number;
  email_user_creator: number;
  website_icone: number | null;
  website_keywords: string | null;
  website_language: number;
  website_title: string | null;
  website_url: string;
};

export default function Settings() {
  const settings = useSignal<MainSettings | null>(null);
  if(settings === null) retrieveMain().then(settings => settings.value = settings)

  return <h1>Settings</h1>;
}
