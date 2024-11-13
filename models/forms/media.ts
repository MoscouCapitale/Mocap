import { FormField, ObjFormField } from "@models/Form.ts";
import { Audio, Image, MediaType, Misc, Video } from "@models/Medias.ts";
import { ObjectRelations } from "@models/forms/bricks.tsx";

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

const ObjectFitInput: ObjFormField<Image | Video> = {
  name: "object_fit",
  type: "select",
  label: "Ajustement",
  options: [
    {
      label: "best",
      value: "best",
    },
    {
      label: "cover",
      value: "cover",
    },
    {
      label: "contain",
      value: "contain",
    },
  ],
};

const ImageFormFields: ObjFormField<Image>[] = [
  ...DefaultMediaFormValues,
  ObjectFitInput as (Omit<FormField, "name"> & { name: keyof Image }),
  ObjectRelations.cta as ObjFormField<Image>,
];

const VideoFormFields: ObjFormField<Video>[] = [
  ...DefaultMediaFormValues,
  ObjectFitInput,
  {
    name: "autoplay",
    type: "checkbox",
    label: "Lecture auto.",
  },
  // ObjectRelations.controls as ObjFormField<Video>, // FIXME: add better video controls
  ObjectRelations.cta as ObjFormField<Video>,
];

const AudioFormFields: ObjFormField<Audio>[] = [
  ...DefaultMediaFormValues,
  {
    name: "autodetect_source",
    type: "checkbox",
    label: "Source auto.",
  },
];

const MiscFormFields: ObjFormField<Misc>[] = [
  ...DefaultMediaFormValues,
];
