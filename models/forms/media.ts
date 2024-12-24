import { FormField, ObjFormField } from "@models/Form.ts";
import { Audio, Image, MediaObjectFit, MediaType, Misc, PlayerControls, Video } from "@models/Medias.ts";

export const getMediaFormFromType = (type: MediaType): FormField[] => {
  switch (type) {
    case MediaType.Images:
      return ImageFormFields;
    case MediaType.Videos:
      return VideoFormFields;
    case MediaType.Audios:
      return AudioFormFields;
    case MediaType.Misc:
      return MiscFormFields;
    default:
      return [];
  }
};

const DefaultMediaFormValues: ObjFormField<Image | Video | Audio | Misc>[] = [
  {
    name: "display_name",
    type: "string",
    label: "Nom",
    required: true,
  },
  {
    name: "alt",
    type: "string",
    label: "Description",
  },
];

const ObjectFitInput: ObjFormField<{ mediaFit: boolean }> = {
  name: "mediaFit",
  type: "select",
  label: "Ajustement",
  defaultValue: "best",
  options: [
    {
      label: "Meilleur",
      value: "best",
    },
    {
      label: "Remplir",
      value: "cover",
    },
    {
      label: "Contenu",
      value: "contain",
    },
  ],
  trigger: {
    fieldName: ["media"],
    condition: (v) => v?.type === "Images" || v?.type === "Videos",
  },
};

const PlayControlsSharedAttributes: Omit<FormField, "name"> = {
  type: "checkbox",
  defaultValue: true,
  trigger: {
    fieldName: ["media", "audio"],
    condition: (v) => v?.type === "Videos" || v?.type === "Audios",
  },
};

const PlayerControlsInput: ObjFormField<{ mediaFit: MediaObjectFit; controls: PlayerControls }>[] = [
  {
    name: "controls.autoplay",
    label: "Lecture automatique",
    ...PlayControlsSharedAttributes,
  },
  {
    name: "controls.play",
    label: "Lecture",
    ...PlayControlsSharedAttributes,
  },
  {
    name: "controls.timeline",
    label: "Barre de progression",
    ...PlayControlsSharedAttributes,
  },
  {
    name: "controls.duration",
    label: "Durée",
    ...PlayControlsSharedAttributes,
  },
  {
    name: "controls.volumeIcon",
    label: "Icône volume",
    ...PlayControlsSharedAttributes,
  },
  {
    name: "controls.volumeBar",
    label: "Barre de volume",
    ...PlayControlsSharedAttributes,
  },
];

const ImageFormFields: ObjFormField<Image>[] = [
  ...DefaultMediaFormValues,
];

const VideoFormFields: ObjFormField<Video>[] = [
  ...DefaultMediaFormValues,
];

const AudioFormFields: ObjFormField<Audio>[] = [
  ...DefaultMediaFormValues,
];

const MiscFormFields: ObjFormField<Misc>[] = [
  ...DefaultMediaFormValues,
];

export const MediaControlsFormField: ObjFormField<{ mediaFit: MediaObjectFit; controls: PlayerControls }>[] = [
  ObjectFitInput,
  ...PlayerControlsInput,
];
