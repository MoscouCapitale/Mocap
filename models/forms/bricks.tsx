import { LabeledToolTip } from "@islands/UI";
import {
  EBrickType,
  IAlbum,
  IArtist,
  IBrickAlbum,
  IBrickHighlight,
  IBrickText,
  ILink,
  ITrack
} from "../Bricks.ts";
import { FormField, ObjFormField } from "../Form.ts";

export enum ETableNames {
  albums = "albums",
  artists = "artists",
  links = "links",
  // nodes = "nodes",
  settings = "settings",
  tracks = "tracks",
  // users = "users",
}

/**
 * Export all the form fields for the different types of objects that can be created, and saved in the database.
 *
 * Include the bricks, but also the secondary objects like cta, controls, object_fit, etc. */

export const getObjectFormFromType = (type: ETableNames | EBrickType): FormField[] | null => {
  switch (type) {
    case ETableNames.albums:
      return AlbumFormFields;
    case ETableNames.artists:
      return ArtistFormFields;
    case ETableNames.links:
      return LinkFormFields;
    // case ETableNames.nodes:
    case ETableNames.settings:
      return []; //FIXME:
    case ETableNames.tracks:
      return TrackFormFields;
    // case ETableNames.users:
    /** Bricks */
    case EBrickType.album:
      return BrickAlbumFormFields;
    case EBrickType.highlight:
      return BrickHighlightFormFields;
    case EBrickType.text:
      return BrickTextFormFields;
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

export const ObjectRelations: Record<string, FormField> = {
  link: {
    name: "link",
    type: "relation",
    label: "Lien",
    placeholder: " ",
    relation: {
      type: "links",
      configurable: true,
      multiple: false,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  links: {
    name: "link",
    type: "relation",
    label: "Lien",
    placeholder: " ",
    relation: {
      type: "links",
      configurable: true,
      multiple: false,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  tracks: {
    name: "track",
    type: "relation",
    label: "Track",
    placeholder: " ",
    required: true,
    relation: {
      type: "tracks",
      configurable: true,
      multiple: false,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  albums: {
    name: "album",
    type: "relation",
    label: "Album",
    relation: {
      type: "albums",
      configurable: true,
      multiple: true,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  artists: {
    name: "artist",
    type: "relation",
    label: "Artiste",
    relation: {
      type: "artists",
      configurable: true,
      multiple: true,
      allowEmpty: true,
      allowInsert: true,
    },
  },
};

const BrickHighlightFormFields: ObjFormField<IBrickHighlight>[] = [
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
    name: "variant",
    type: "select",
    label: "Variant",
    options: [
      {
        label: "default",
        value: "Default",
      },
      {
        label: "hero",
        value: "Hero-section",
      },
    ],
  },
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
  {
    name: "link",
    type: "relation",
    label: "Lien",
    placeholder: " ",
    relation: {
      type: "links",
      configurable: true,
      multiple: false,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  // {
  //   name: "is_embed",
  //   type: "checkbox",
  //   label: (
  //     <LabeledToolTip
  //       label="Intégration"
  //       text="Le 'média' sera remplacé par une intégration spécifiée dans le 'Lien' (Spotify, SoundCloud, etc)."
  //     />
  //   ),
  //   trigger: {
  //     fieldName: ["link"],
  //     condition: (v) => !!getEmbedTargetFromLink(v ?? ""),
  //   },
  // },
  // ...MediaControlsFormField,
];

const BrickAlbumFormFields: ObjFormField<IBrickAlbum>[] = [
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
  {
    name: "link",
    type: "relation",
    label: "Lien",
    placeholder: " ",
    relation: {
      type: "links",
      configurable: true,
      multiple: false,
      allowEmpty: true,
      allowInsert: true,
    },
  },
  {
    name: "album",
    type: "relation",
    label: "Album",
    relation: {
      type: "albums",
      configurable: true,
      multiple: false,
      allowEmpty: false,
      allowInsert: true,
    },
  },
];

const BrickTextFormFields: ObjFormField<IBrickText>[] = [
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

const ArtistFormFields: ObjFormField<IArtist> = [...DefaultBricksFormValues];

const LinkFormFields: ObjFormField<ILink> = [
  ...DefaultBricksFormValues,
  {
    name: "url",
    type: "string",
    label: "Link",
    required: true,
  },
  {
    name: "icon_url",
    type: "string",
    label: "Icon link",
  },
  {
    name: "title",
    type: "string",
    label: "Title",
  },
];

const TrackFormFields: ObjFormField<ITrack> = [
  ...DefaultBricksFormValues,
  {
    name: "artists",
    type: "relation",
    label: "Artiste",
    relation: {
      type: "artists",
      configurable: true,
      multiple: true,
      allowEmpty: true,
      allowInsert: true,
    },
  },
];

const AlbumFormFields: ObjFormField<IAlbum> = [
  ...DefaultBricksFormValues,
  {
    name: "type",
    type: "select",
    label: "Type",
    options: Object.entries(EBrickType).map(([value, label]) => ({ value, label })),
  },
  {
    name: "tracks",
    type: "relation",
    label: "Tracks",
    relation: {
      type: "tracks",
      configurable: true,
      multiple: true,
      allowEmpty: true,
      allowInsert: true,
    },
  },
];
