import { Database } from "@models/database.ts";
import { AvailablePlayerControls } from "@islands/Player/Video/index.tsx";
import { isEmpty, pickBy } from "lodash";

interface Media {
  id: string;
  name: string;
  display_name: string;
  public_src?: string;
  alt?: string;
  type: MediaType;
  filesize?: number;
  extension?: string;
  updated_at?: string; // Date to iso string
  created_at?: string; // Date to iso string
}

interface Image extends Media {
  // object_fit: MediaObjectFit;
  // cta: MediaCTA;
  type: MediaType.Images;
}

interface Video extends Media {
  // cover: Image; TODO: Add cover to video
  // object_fit: MediaObjectFit;
  // autoplay: boolean;
  // controls: MediaControls;
  // cta: MediaCTA;
  type: MediaType.Videos;
}

interface Audio extends Media {
  // cover: Image; TODO: Add cover to audio
  // autodetect_source: boolean;
  // controls: MediaControls;
  type: MediaType.Audios;
}

interface Misc extends Media {
  type: MediaType.Misc;
}

type DatabaseMedia = Media;

type MediaCTA = {
  id: number;
  label: string;
  url: string;
};

export type PlayerControls = {
  autoplay: boolean;
  play: boolean;
  timeline: boolean;
  duration: boolean;
  volumeIcon: boolean;
  volumeBar: boolean;
};
export type ImageControls = {
  type: MediaType.Images;
  fit: MediaObjectFit;
};

export type VideoControls = {
  type: MediaType.Videos;
  fit: MediaObjectFit;
} & PlayerControls;

export type AudioControls = {
  type: MediaType.Audios;
} & PlayerControls;

export type MediaControls = ImageControls | VideoControls | AudioControls;

export const getPlayerControlsFromMediaControls = (controls?: PlayerControls) =>
  isEmpty(controls) ? [] : Object.keys(pickBy(controls, (v: boolean) => v === false)) as AvailablePlayerControls[];

export const getStyleFit = (fit: MediaObjectFit) => fit === "cover" || fit === "best" ? "object-cover" : "object-contain";

enum MediaType {
  Images = "Images",
  Videos = "Videos",
  Audios = "Audios",
  Misc = "Misc",
}

export type MediaControlsFromType<T extends MediaType> = T extends MediaType.Images ? {
    fit: MediaObjectFit;
  }
  : T extends MediaType.Videos ? {
      fit: MediaObjectFit;
      autoplay: boolean;
      play: boolean;
      progress: boolean;
      duration: boolean;
      volume: boolean;
    }
  : T extends MediaType.Audios ? {
      autoplay: boolean;
      play: boolean;
      progress: boolean;
      duration: boolean;
      volume: boolean;
    }
  : null;

export type MediaObjectFit = "best" | "cover" | "contain";

type MediaSettingsAttributes = MediaCTA | MediaControls | MediaObjectFit;

type uploadFileObject = {
  filetype: string;
  media: Media;
};

type MediaMap = {
  Images: Image;
  Videos: Video;
  Audios: Audio;
  Misc: Misc;
};

const MediaTableNames = {
  cover: "Medias",
  controls: "Medias_Controls",
  cta: "CTA_Link",
  object_fit: "Media_Adjustement",
};

const defaultPrivateFields = ["id", "created_at", "updated_at", "public_src", "hidden"];

const MediaModifiableAttributes = {
  display_name: "Nom",
  alt: "Description",
  object_fit: "Positionnement",
  autoplay: "Lecture auto.",
  controls: "Controles",
  // cta: "Lien", // TODO: is it really necessary ? CTA is already there on the bricks...
  autodetect_source: "Source auto.",
};

const acceptedFileTypeMap: { [key in MediaType]: string[] } = {
  "Images": [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
  ],
  "Videos": [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mpeg",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/3gpp",
  ],
  "Audios": [
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
    "audio/webm",
    "audio/3gpp",
    "audio/3gpp2",
    "audio/x-ms-wma",
    "audio/vnd.rn-realaudio",
    "audio/midi",
    "audio/x-midi",
    "audio/vnd.wav",
  ],
  "Misc": [
    "application/pdf",
    "application/zip",
    "text/markdown",
  ],
};

type MediaByType<T extends MediaType> = MediaMap[T];

export type {
  Audio,
  DatabaseMedia,
  Image,
  Media,
  MediaByType,
  MediaCTA,
  MediaSettingsAttributes,
  Misc,
  uploadFileObject,
  Video,
};
export { acceptedFileTypeMap, defaultPrivateFields, MediaModifiableAttributes, MediaTableNames, MediaType };
