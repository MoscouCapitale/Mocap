import { Database } from "@models/database.ts";
import { JSX } from "https://esm.sh/v128/preact@10.19.6/src/index.js";
import { BricksType } from "@models/Bricks.ts";

interface AppStorage {
  navbarExpanded?: boolean;
}

type ConfirmationModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type DropdownItem = {
  id: number | string;
  label: string | JSX.Element;
  value: string;
  isActive?: boolean;
  onClick: () => void;
  onMouseEnter?: (e: MouseEvent, id: number | string) => void;
  onMouseLeave?: (e: MouseEvent, id: number | string) => void;
};

type Modify<T, R> = Omit<T, keyof R> & R;

type Default_SettingsMain =
  Database["public"]["Tables"]["Website_Settings_Main_Emails"]["Row"];
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
type SettingsAPIs =
  Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"];
type Default_SettingsMisc =
  Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"];
type SettingsMisc = Modify<
  Default_SettingsMisc,
  {
    website_language: "fr" | "en";
  }
>;

type mainSettings = [SettingsMain, SettingsAPIs, SettingsMisc];

type mediasSettings =
  Database["public"]["Tables"]["Website_Settings_Medias"]["Row"];

type stylesSettings =
  Database["public"]["Tables"]["Website_Settings_Styles"]["Row"];

type miscSettings =
  Database["public"]["Tables"]["Website_Settings_Misc"]["Row"];

type DatabaseAttributesType = {
  [key: string]: {
    name: string;
    table: string;
    modifiable?: boolean;
    linkedTables?: string[];
    multiple?: boolean;
    parentTables?: string[];
  };
};

const DatabaseAttributes: DatabaseAttributesType = {
  media: {
    name: "Média",
    table: "Medias",
    parentTables: ["Bricks_Single", "Bricks_Album", "Bricks_HeroSection", "Bricks_Text"],
  },
  cover: {
    name: "Cover",
    table: "Medias",
  },
  controls: {
    name: "Controles",
    table: "Medias_Controls",
    modifiable: true,
  },
  cta: {
    name: "Lien",
    table: "CTA_Link",
    modifiable: true,
    parentTables: ["Bricks_Single", "Bricks_Album", "Bricks_HeroSection"]
  },
  platforms: {
    name: "Liens vers plateformes",
    table: "Platform_Link",
    modifiable: true,
    linkedTables: ["platform"],
    multiple: true,
    parentTables: ["Bricks_Single", "Bricks_Album", "Bricks_Track"]
  },
  platform: {
    name: "Plateforme",
    table: "Platform",
    modifiable: true,
    parentTables: ["Platform_Link"]
  },
  track: {
    name: "Track",
    table: "Track",
    modifiable: true,
    linkedTables: ["platforms", "artist"],
    parentTables: ["Bricks_Single"]
  }, 
  tracklist: {
    name: "Track",
    table: "Track",
    modifiable: true,
    multiple: true,
    linkedTables: ["platforms", "artist"],
    parentTables: ["Bricks_Album"]
  }, 
  artist: {
    name: "Artistes",
    table: "Artist",
    multiple: true,
    modifiable: true,
  },
};

const DatabaseAttributesKeys = Object.keys(DatabaseAttributes)

export type {
  AppStorage,
  ConfirmationModalProps,
  DropdownItem,
  mainSettings,
  mediasSettings,
  miscSettings,
  stylesSettings,
};

export { DatabaseAttributes, DatabaseAttributesKeys };
