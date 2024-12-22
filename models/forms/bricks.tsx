import { LabeledToolTip } from "@islands/UI";
import { Album, Artist, AudioBrick, HeroSection, Highlight, Platform, PlatformLink, Single, Text, Track } from "@models/Bricks.ts";
import { AvailableFormRelation, FormField, ObjFormField } from "@models/Form.ts";
import { MediaCTA } from "@models/Medias.ts";
import { MediaControlsFormField } from "@models/forms/media.ts";

export type AllMocapObjectsTypes =
  | "HeroSection"
  | "Single"
  | "Highlight"
  | "Album"
  | "Track"
  | "Artist"
  | "Platform"
  | "Audio"
  | "Text"
  | "Platform_Link"
  | "CTA_Link"
  | "Controls";

/**
 * Export all the form fields for the different types of objects that can be created, and saved in the database.
 *
 * Include the bricks, but also the secondary objects like cta, controls, object_fit, etc. */

export const getObjectFormFromType = (type: AllMocapObjectsTypes): FormField[] | null => {
  switch (type) {
    case "HeroSection":
      return HeroSectionFormFields;
    case "Highlight":
      return HighlightFormFields;
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
    case "Audio":
      return AudioFormFields;
    case "Text":
      return TextFormFields;
    case "Platform_Link":
      return PlatformLinkFormFields;
    case "CTA_Link":
      return CTAFormFields;
    default:
      return null;
  }
};

const DefaultBricksFormValues: ObjFormField<{ name: "name" }>[] = [
  {
    name: "name",
    type: "string",
    label: <LabeledToolTip label="Nom" text="Le nom unique, de l'élément qui permettera de l'identifier" />,
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
      allowEmpty: true,
      allowInsert: true,
    },
  },
  track: {
    name: "track",
    type: "relation",
    label: "Track",
    placeholder: " ",
    required: true,
    relation: {
      type: "track",
      configurable: true,
      multiple: false,
      allowEmpty: true,
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
      allowEmpty: true,
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
      allowEmpty: true,
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
      allowEmpty: true,
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
      allowEmpty: true,
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
      allowEmpty: true,
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
      filetype: ["Images", "Videos"],
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

const HighlightFormFields: ObjFormField<Highlight>[] = [
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
      filetype: ["Images", "Videos"],
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  {
    name: "link",
    type: "string",
    label: (
      <LabeledToolTip
        label="Lien"
        text="Si un lien Youtube/Spotify/Soundcloud est renseigné, alors le 'média' sera remplacé par une intégration vers ce lien."
      />
    ),
  },
  ...MediaControlsFormField,
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
      filetype: ["Images", "Videos"],
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
  ...MediaControlsFormField,
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
      filetype: ["Images", "Videos"],
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
  ...MediaControlsFormField,
];

const TextFormFields: ObjFormField<Text>[] = [
  ...DefaultBricksFormValues,
  {
    name: "text",
    type: "markdown",
    label: <LabeledToolTip label="Texte" text="Texte de la brique. Supporte la mise en forme en markdown." />,
  },
  {
    name: "media",
    type: "file",
    label: (
      <LabeledToolTip
        label="Image de fond"
        text="Une image qui sera affichée en arrière plan du texte. Elle sera assombrie et floutée pour mettre en avant le texte."
      />
    ),
    inputConfig: {
      filetype: ["Images", "Videos"],
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
];

export const AudioFormFields: ObjFormField<AudioBrick>[] = [
  ...DefaultBricksFormValues,
  {
    name: "media",
    type: "file",
    label: <LabeledToolTip label="Média" text="Cover du son. Si aucun média n'est renseigné, la couleur du site sera utilisée." />,
    inputConfig: {
      filetype: ["Images", "Videos"],
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  {
    name: "audio",
    type: "file",
    label: "Audio",
    inputConfig: {
      filetype: ["Audios"],
      onClickInput: () => {},
      customLabel: "Parcourir la médiathèque",
    },
  },
  ObjectRelations.track as ObjFormField<AudioBrick>,
  ...MediaControlsFormField,
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
