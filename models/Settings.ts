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

// FIXME: implement all types `NI${type}`

const defaultEmailFieldProps: Omit<FormField, "name"> = {
  type: "NI",
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
    type: "NI",
    placeholder: "Spotify API Key",
  },
  {
    name: "api_soundcloud",
    type: "NI",
    placeholder: "Soundcloud API Key",
  },
  {
    name: "api_deezer",
    type: "NI",
    placeholder: "Deezer API Key",
  },
  {
    name: "api_youtube_music",
    type: "NI",
    placeholder: "YouTube Music API Key",
  },
  {
    name: "api_amazon_music",
    type: "NI",
    placeholder: "Amazon Music API Key",
  },
  {
    name: "api_tidal",
    type: "NI",
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

export const MainSettingsDBObject: {
  [key: FormField["name"]]: FormFieldValue;
} = Object
  .fromEntries(MainSettingsFormFields.map((field) => [field.name, ""]));

export const MediasSettingsFormFields: FormField[] = [
  {
    name: "media_max_size_mb",
    type: "NI",
    placeholder: "Media max size (mb)",
  },
  {
    name: "media_max_size_height",
    type: "NI",
    placeholder: "Media max size (height)",
  },
  {
    name: "media_auto_optimize",
    type: "NI",
    placeholder: "Media auto optimize",
  },
  {
    name: "media_lazyload",
    type: "NI",
    placeholder: "Media lazyload",
  },
];

export const MediasSettingsDBObject: {
  [key: FormField["name"]]: FormFieldValue;
} = Object
  .fromEntries(MediasSettingsFormFields.map((field) => [field.name, ""]));

export const StylesSettingsFormFields: FormField[] = [
  {
    name: "style_color_auto",
    type: "NI",
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
    type: "select",
    placeholder: "Police principale",
    options: [
      { label: "Messina", value: "Messina Sans" },
      { label: "Arial", value: "Arial" },
      { label: "Helvetica", value: "Helvetica" },
    ],
  },
  {
    name: "style_font_secondary",
    type: "select",
    placeholder: "Police secondaire",
    options: [
      { label: "Messina", value: "Messina Sans" },
      { label: "Arial", value: "Arial" },
      { label: "Helvetica", value: "Helvetica" },
    ],
  },
];

export const StylesSettingsDBObject: {
  [key: FormField["name"]]: FormFieldValue;
} = Object
  .fromEntries(StylesSettingsFormFields.map((field) => [field.name, ""]));
