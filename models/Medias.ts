import { Database } from "@models/database.ts";

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
  object_fit: MediaObjectFit;
  cta: MediaCTA;
  type: MediaType.Images;
}

interface Video extends Media {
  // cover: Image; TODO: Add cover to video
  object_fit: MediaObjectFit;
  autoplay: boolean;
  controls: MediaControls;
  cta: MediaCTA;
  type: MediaType.Videos;
}

interface Audio extends Media {
  // cover: Image; TODO: Add cover to audio
  autodetect_source: boolean;
  controls: MediaControls;
  type: MediaType.Audios;
}

interface Misc extends Media {
  type: MediaType.Misc;
}

type DatabaseMedia =
  & Omit<
    Database["public"]["Tables"]["Medias"]["Row"],
    "controls" | "object_fit" | "cta"
  >
  & {
    controls: MediaControls;
    object_fit: MediaObjectFit;
    cta: MediaCTA;
  };

type MediaCTA = {
  id: number;
  label: string;
  url: string;
};

export type MediaControls = {
  id: number;
  name: string;
  play: boolean;
  progress: boolean;
  duration: boolean;
  volume: boolean;
};

enum MediaType {
  Images = "Images",
  Videos = "Videos",
  Audios = "Audios",
  Misc = "Misc",
}

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
    "application/x-rar-compressed",
  ],
};

type MediaByType<T extends MediaType> = MediaMap[T];

export type {
  Audio,
  DatabaseMedia,
  Image,
  Media,
  MediaByType,
  MediaSettingsAttributes,
  Misc,
  uploadFileObject,
  Video,
  MediaCTA,
};
export {
  acceptedFileTypeMap,
  defaultPrivateFields,
  MediaModifiableAttributes,
  MediaTableNames,
  MediaType,
};
