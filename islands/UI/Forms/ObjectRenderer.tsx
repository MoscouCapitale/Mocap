import { Artist, availBricks, BricksType, Platform, Track } from "@models/Bricks.ts";
import { MediaControls, MediaCTA } from "@models/Medias.ts";
import { AllMocapObjectsTypes, getObjectFormFromType } from "@models/forms/bricks.tsx";
import { useEffect, useMemo, useState } from "preact/hooks";
import ContentForm from "@islands/UI/ContentForm.tsx";
import { ContentFormValue } from "@islands/UI/ContentForm.tsx";

type SupportedObjects =
  | availBricks
  | Track
  | Platform
  | MediaCTA
  | MediaControls
  | Artist;

type ObjectRendererProps = {
  /** The type of the element to the form be rendered */
  type: AllMocapObjectsTypes;
  /** The current content of the object. It NEEDS to have all fields, even empty. */
  content?: SupportedObjects;
  /** Function returned with the new object when a field changes */
  onChange?: (obj: SupportedObjects) => void;
  /** Simple function to update the content of the object */
  triggerContentUpdate?: string; // TODO: it
};

// TODO: for perf change on blur ?

/**
 * Render the full form of an object.
 *
 * Support main elements (ex. Bricks), but also the secondary one (platforms, track, cta, etc...)
 *
 * @param param0
 * @returns
 */
export default function ObjectRenderer({
  type,
  content,
  onChange,
  triggerContentUpdate,
}: ObjectRendererProps) {
  const form = useMemo(() => getObjectFormFromType(type), [type]);
  // Do no set content as a dependency, as it will cause a re-render on each event (if content is set)
  const initialData = useMemo(() => content ?? createEmptyObject(type), [type, content]);

  const [data, setDatas] = useState<SupportedObjects | null>();

  if (!form || !initialData) {
    console.error("Error while trying to rendering object for ", type);
    return null;
  }

  useEffect(() => {
    if (onChange && data) onChange(data);
  }, [data]);

  return (
    <div class="flex flex-col gap-6 flex-wrap">
      <ContentForm
        form={form}
        initialData={initialData as ContentFormValue}
        setDatas={setDatas as unknown as (
          value: ContentFormValue,
        ) => void}
      />
    </div>
  );
}

/** Create an empty object from the given type */
function createEmptyObject(
  type: AllMocapObjectsTypes,
): Omit<SupportedObjects, "id"> | null {
  switch (type) {
    case BricksType.HeroSection:
      return {
        name: "",
        title: "",
        subtitle: "",
        media: null,
        cta: {},
        style: "scrolling-hero",
      };
    case BricksType.Highlight:
      return {
        name: "",
        title: "",
        subtitle: "",
        media: null,
        link: "",
      };
    case BricksType.Single:
      return {
        name: "",
        title: "",
        media: null,
        track: {},
        hoverable: false,
        cta: {},
        platforms: [],
      };
    case BricksType.Album:
      return {
        name: "",
        title: "",
        media: null,
        hoverable: true,
        platforms: [],
        tracklist: [],
        cta: {},
      };
    case BricksType.Text:
      return {
        name: "",
        text: "",
      };
    case BricksType.Platform_Link:
      return {
        name: "",
        url: "",
        platform: {},
      };
    case "CTA_Link":
      return {
        label: "",
        url: "",
      };
    case "Controls":
      return {
        name: "",
        play: false,
        progress: false,
        duration: false,
        volume: false,
      };
    case "Platform":
      return {
        name: "",
        icon: "",
      };
    case "Artist":
      return {
        name: "",
        url: "",
      };
    case "Track":
      return {
        name: "",
        artist: [],
        platforms: [],
      };
    default:
      return null;
  }
}
