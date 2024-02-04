import { useEffect, useState } from "preact/hooks";

import { mediasSettings } from "@models/App.ts";

import InlineSingleInput from "@islands/Settings/SettingsChilds/InlineSingleInput.tsx";
import Button from "@islands/Button.tsx";

export default function Medias() {
  // TODO: correct modified state
  const [modified, setModified] = useState<boolean>(true);
  const [settings, setSettings] = useState<mediasSettings>({
    id: 0,
    media_max_size_mb: 0,
    media_max_size_height: 0,
    media_auto_optimize: false,
    media_lazyload: false,
    created_at: "",
    modified_at: "",
  });

  useEffect(() => {
    if (settings.id === 0)
      fetch("/api/settings/medias")
        .then((res) => res.json())
        .then((data) => {
          console.log(data[0]);
          if (data[0]) setSettings(data[0]);
        });
  }, []);

  useEffect(() => {
    console.log("settings arte: ", settings);
  }, [settings]);

  const updateSettings = () => {
    fetch("/api/settings/medias", {
      method: "POST",
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((data) => setSettings(data));
  };

  return (
    <>
      {modified && <Button text={"Sauvegarder"} onClick={updateSettings} className={{ wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]" }} />}
      {settings.id !== 0 && (
        <section class="w-full flex-col justify-start items-start gap-10 inline-flex">
          {/* TODO: add info: will not affect already uploaded medias */}
          <InlineSingleInput
            label={"Taille max des médias"}
            subLabel="(mb)"
            type={"number"}
            value={settings?.media_max_size_mb ?? 0}
            //   TODO: fix those errors
            onChange={(value) => setSettings({ ...settings, media_max_size_mb: value })}
          />
          {/* TODO: add info: will not affect already uploaded medias */}
          <InlineSingleInput
            label={"Taille max"}
            subLabel="(hauteur / largeur)"
            type={"number"}
            value={settings?.media_max_size_height ?? 0}
            onChange={(value) => setSettings({ ...settings, media_max_size_height: value })}
          />
          <InlineSingleInput
            label={"Gestion auto de la qualité"}
            subLabel="(recommandé)"
            type={"checkbox"}
            value={settings?.media_auto_optimize ?? false}
            onChange={(value) => setSettings({ ...settings, media_auto_optimize: value })}
          />
          <InlineSingleInput
            label={"Chargement différé"}
            subLabel="(recommandé)"
            type={"checkbox"}
            value={settings?.media_lazyload ?? false}
            onChange={(value) => setSettings({ ...settings, media_lazyload: value })}
          />
        </section>
      )}
    </>
  );
}
