import { AvailableFormRelation, FormField, ObjFormField } from "@models/Form.ts";
import {
  Audio,
  Image,
  Media,
  MediaControls,
  MediaCTA,
  MediaObjectFit,
  MediaType,
  Misc,
  Video,
} from "@models/Medias.ts";
import { Album, Artist, HeroSection, Platform, PlatformLink, Single, Text, Track } from "@models/Bricks.ts";
import { LabeledToolTip, Tooltip } from "@islands/UI/Tooltip.tsx";

export type AllMocapObjectsTypes =
  | "HeroSection"
  | "Single"
  | "Album"
  | "Track"
  | "Artist"
  | "Platform"
  | "Text"
  | "Platform_Link"
  | "CTA_Link"
  | "Controls";

/**
 * Export all the form fields for the different types of objects that can be created, and saved in the database.
 *
 * Include the bricks, but also the secondary objects like cta, controls, object_fit, etc. */

export const getObjectFormFromType = (
  type: AllMocapObjectsTypes,
): FormField[] | null => {
  switch (type) {
    case "HeroSection":
      return HeroSectionFormFields;
    case "Single":
      return SingleFormFields;
    case "Album":
      return AlbumFormFields;
    case "Track":
      return TrackFormFields;
    case "Artist":
      return ArtistFormFields;
    case "Platform":
      return PlatformFormFields;
    case "Text":
      return TextFormFields;
    case "Platform_Link":
      return PlatformLinkFormFields;
    case "CTA_Link":
      return CTAFormFields;
    case "Controls":
      return ControlsFormFields;
    default:
      return null;
  }
};

const DefaultBricksFormValues: ObjFormField<
  HeroSection | Single | Album | Track | Artist | Platform
>[] = [
  {
    name: "name",
    type: "string",
    label: (
      <LabeledToolTip
        label="Nom"
        text="Le nom unique, de l'élément qui permettera de l'identifier"
      />
    ),
    required: true,
  },
];

export const ObjectRelations: Record<AvailableFormRelation, FormField> = {
  cta: {
    name: "cta",
    type: "relation",
    label: "Lien",
    placeholder: " ",
    relation: {
      type: "cta",
      configurable: true,
      multiple: false,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  track: {
    name: "track",
    type: "relation",
    label: "Track",
    placeholder: " ",
    relation: {
      type: "track",
      configurable: true,
      multiple: false,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  tracklist: {
    name: "tracklist",
    type: "relation",
    label: "Tracklist",
    relation: {
      type: "tracklist",
      configurable: true,
      multiple: true,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  artist: {
    name: "artist",
    type: "relation",
    label: "Artiste",
    relation: {
      type: "artist",
      configurable: true,
      multiple: true,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  platforms: {
    name: "platforms",
    type: "relation",
    label: "Plateformes",
    relation: {
      type: "platforms",
      configurable: true,
      multiple: true,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  platform: {
    name: "platform",
    type: "relation",
    label: "Icone",
    placeholder: " ",
    relation: {
      type: "platform",
      configurable: true,
      multiple: false,
      allowEmpty: false,
      allowInsert: true,
    },
  },
  controls: {
    name: "controls",
    type: "relation",
    label: "Contrôles",
    placeholder: " ",
    relation: {
      type: "controls",
      configurable: true,
      multiple: false,
      allowEmpty: false,
      allowInsert: true,
    },
  },
};

const HeroSectionFormFields: ObjFormField<HeroSection>[] = [
  ...DefaultBricksFormValues,
  {
    name: "title",
    type: "string",
    label: "Titre",
    required: true,
  },
  {
    name: "subtitle",
    type: "string",
    label: "Sous-titre",
  },
  {
    name: "media",
    type: "file",
    label: "Média",
    inputConfig: {
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  ObjectRelations.cta as ObjFormField<HeroSection>,
  {
    name: "style",
    type: "select",
    label: "Style",
    options: [
      {
        label: "scrolling-hero",
        value: "scrolling-hero",
      },
    ],
  },
];

const SingleFormFields: ObjFormField<Single>[] = [
  ...DefaultBricksFormValues,
  {
    name: "title",
    type: "string",
    label: "Titre",
    required: true,
  },
  {
    name: "media",
    type: "file",
    label: "Média",
    inputConfig: {
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  ObjectRelations.track as ObjFormField<Single>,
  {
    name: "hoverable",
    type: "checkbox",
    label: "Effet au survol",
  },
  ObjectRelations.cta as ObjFormField<Single>,
  ObjectRelations.platforms as ObjFormField<Single>,
];

const AlbumFormFields: ObjFormField<Album>[] = [
  ...DefaultBricksFormValues,
  {
    name: "title",
    type: "string",
    label: "Titre",
    required: true,
  },
  {
    name: "media",
    type: "file",
    label: "Média",
    inputConfig: {
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  ObjectRelations.tracklist as ObjFormField<Album>,
  ObjectRelations.cta as ObjFormField<Album>,
  {
    name: "hoverable",
    type: "checkbox",
    label: "Effet au survol",
  },
];

const TextFormFields: ObjFormField<Text>[] = [
  {
    name: "text",
    type: "string",
    label: "Texte",
  },
  {
    name: "special",
    type: "string",
    label: "Spécial",
  },
];

const CTAFormFields: ObjFormField<MediaCTA>[] = [
  {
    name: "label",
    type: "string",
    label: "Label",
    required: true,
  },
  {
    name: "url",
    type: "string",
    label: "URL",
    required: true,
  },
];

const ControlsFormFields: ObjFormField<MediaControls>[] = [
  {
    name: "name",
    type: "string",
    label: "Nom",
    required: true,
  },
  {
    name: "play",
    type: "checkbox",
    label: "Play",
  },
  {
    name: "progress",
    type: "checkbox",
    label: "Progress",
  },
  {
    name: "duration",
    type: "checkbox",
    label: "Duration",
  },
  {
    name: "volume",
    type: "checkbox",
    label: "Volume",
  },
];

export const ArtistFormFields: ObjFormField<Artist>[] = [
  {
    name: "name",
    type: "string",
    label: "Nom",
    required: true,
  },
  {
    name: "url",
    type: "string",
    label: "URL",
    required: true,
  },
];

export const PlatformFormFields: ObjFormField<Platform>[] = [
  {
    name: "name",
    type: "string",
    label: "Nom",
    required: true,
  },
  {
    name: "icon",
    type: "string",
    label: "Icone",
    required: true,
  },
];

export const TrackFormFields: ObjFormField<Track>[] = [
  {
    name: "name",
    type: "string",
    label: "Nom",
    required: true,
  },
  ObjectRelations.artist as ObjFormField<Track>,
  ObjectRelations.platforms as ObjFormField<Track>,
];

export const PlatformLinkFormFields: ObjFormField<PlatformLink>[] = [
  {
    name: "name",
    type: "string",
    label: "Nom",
    required: true,
  },
  {
    name: "url",
    type: "string",
    label: "URL",
    required: true,
  },
  ObjectRelations.platform as ObjFormField<PlatformLink>,
];