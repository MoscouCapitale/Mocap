import { FormField, FormFieldValue } from "@models/Form.ts";

export type FetchableSettingsKeys =
  | "main"
  | "styles"
  | "medias"
  | "misc";

export const FetchableSettingsKeysArray: FetchableSettingsKeys[] = [
  "main",
  "styles",
  "medias",
  "misc",
];

const defaultEmailFieldProps: Omit<FormField, "name"> = {
  type: "email",
  placeholder: "empty if same as admin",
  validation: (v) => {
    if (
      !String(v)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )
    ) {
      return "Invalid email address";
    }
    return null;
  },
};

export const MainSettingsFormFields: FormField[] = [
  {
    name: "email_contact_recipient",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_contact_sender",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_admin_recipient",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_admin_sender",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_logging_recipient",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_logging_sender",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_usercreate_recipient",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_usercreate_sender",
    ...defaultEmailFieldProps,
  },
  {
    name: "email_default_sender",
    ...defaultEmailFieldProps,
    placeholder: "Default sender email",
  },
  {
    name: "api_spotify",
    type: "string",
    placeholder: "Spotify API Key",
  },
  {
    name: "api_soundcloud",
    type: "string",
    placeholder: "Soundcloud API Key",
  },
  {
    name: "api_deezer",
    type: "string",
    placeholder: "Deezer API Key",
  },
  {
    name: "api_youtube_music",
    type: "string",
    placeholder: "YouTube Music API Key",
  },
  {
    name: "api_amazon_music",
    type: "string",
    placeholder: "Amazon Music API Key",
  },
  {
    name: "api_tidal",
    type: "string",
    placeholder: "Tidal API Key",
  },
  {
    name: "website_title",
    type: "string",
    placeholder: "Website Title",
  },
  {
    name: "website_url",
    type: "string",
    placeholder: "Website URL",
  },
  {
    name: "website_icon",
    type: "file",
    placeholder: "Website Icon",
  },
  {
    name: "website_keywords",
    type: "string",
    placeholder: "Website Keywords",
  },
];

export const MainSettingsDBObject: { [key: FormField["name"]]: FormFieldValue } = Object
  .fromEntries(MainSettingsFormFields.map((field) => [field.name, ""]));

export const MediasSettingsFormFields: FormField[] = [
  {
    name: "media_max_size_mb",
    type: "number",
    placeholder: "Media max size (mb)",
  },
  {
    name: "media_max_size_height",
    type: "number",
    placeholder: "Media max size (height)",
  },
  {
    name: "media_auto_optimize",
    type: "checkbox",
    placeholder: "Media auto optimize",
  },
  {
    name: "media_lazyload",
    type: "checkbox",
    placeholder: "Media lazyload",
  },
];

export const MediasSettingsDBObject: { [key: FormField["name"]]: FormFieldValue } =
  Object
    .fromEntries(MediasSettingsFormFields.map((field) => [field.name, ""]));

export const StylesSettingsFormFields: FormField[] = [
  {
    name: "style_color_auto",
    type: "checkbox",
    placeholder: "Gestion auto des couleurs",
  },
  {
    name: "style_color_main",
    type: "color",
    placeholder: "Couleur principale",
  },
  {
    name: "style_color_secondary",
    type: "color",
    placeholder: "Couleur secondaire",
  },
  {
    name: "style_theme_toggle",
    type: "checkbox",
    placeholder: "Changeur de thème",
  },
  {
    name: "style_font_main",
    type: "string",
    placeholder: "Police principale",
  },
  {
    name: "style_font_secondary",
    type: "string",
    placeholder: "Police secondaire",
  },
];

export const StylesSettingsDBObject: { [key: FormField["name"]]: FormFieldValue } =
  Object
    .fromEntries(StylesSettingsFormFields.map((field) => [field.name, ""]));
