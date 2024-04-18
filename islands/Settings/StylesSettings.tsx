import { useEffect, useState } from "preact/hooks";

import { stylesSettings } from "@models/App.ts";

import InlineSingleInput from "@islands/Settings/SettingsChilds/InlineSingleInput.tsx";
import Button from "@islands/Button.tsx";

export default function Medias() {
  // TODO: correct modified state
  const [modified, setModified] = useState<boolean>(true);
  const [settings, setSettings] = useState<stylesSettings>({
    id: 0,
    style_color_auto: false,
    style_color_main: "",
    style_color_secondary: "",
    style_theme_toggle: false,
    style_font_main: "",
    style_font_secondary: "",
    created_at: "",
    modified_at: "",
  });

  useEffect(() => {
    if (settings.id === 0)
      fetch("/api/settings/styles")
        .then((res) => res.json())
        .then((data) => {
          if (data[0]?.length > 0) setSettings(data[0]);
        });
  }, []);

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  const updateSettings = () => {
    fetch("/api/settings/styles", {
      method: "POST",
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((data) => setSettings(data));
  };

  return (
    <>
      {modified && <Button text={"Sauvegarder"} onClick={updateSettings} className={{ wrapper: "absolute top-[calc(2.5rem+0.625rem)] right-[2.5rem]" }} />}

      <div class="w-full flex-col justify-start items-start gap-[15px] inline-flex">
        <div class="text-text font-semibold">Couleurs</div>
        <section class="w-full flex-col justify-start items-start gap-10 inline-flex">
          {/* TODO: add info bubble */}
          <InlineSingleInput
            label={"Gestion auto des couleurs"}
            type={"checkbox"}
            value={settings?.style_color_auto ?? false}
            //   TODO: fix those errors
            onChange={(value) => setSettings({ ...settings, style_color_auto: value === "true" ? true : false })}
          />
          <InlineSingleInput
            label={"Couleur principale"}
            type={"color"}
            value={settings?.style_color_main ?? ""}
            onChange={(value) => setSettings({ ...settings, style_color_main: value })}
          />
          <InlineSingleInput
            label={"Couleur secondaire"}
            type={"color"}
            value={settings?.style_color_secondary ?? ""}
            onChange={(value) => setSettings({ ...settings, style_color_secondary: value })}
          />
          <InlineSingleInput
            label={"Changeur de thème"}
            type={"checkbox"}
            value={settings?.style_theme_toggle ?? false}
            onChange={(value) => setSettings({ ...settings, style_theme_toggle: value === "true" ? true : false })}
          />
        </section>
      </div>

      <div class="w-full flex-col justify-start items-start gap-[15px] inline-flex">
        <div class="text-text font-semibold">Polices</div>
        <section class="w-full flex-col justify-start items-start gap-10 inline-flex">
          <InlineSingleInput
            label={"Police principale"}
            type={"text"}
            value={settings?.style_font_main ?? ""}
            onChange={(value) => setSettings({ ...settings, style_font_main: value })}
          />
          <InlineSingleInput
            label={"Police secondaire"}
            type={"text"}
            value={settings?.style_font_secondary ?? ""}
            onChange={(value) => setSettings({ ...settings, style_font_secondary: value })}
          />
        </section>
      </div>
    </>
  );
}
