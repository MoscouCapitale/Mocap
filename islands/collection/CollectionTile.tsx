import { Image, Video, Audio, Misc } from "@models/Medias.ts";
import { useState } from "preact/hooks";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import MediaDetail from "@islands/collection/MediaDetail.tsx";
import { MediaType } from "@models/Medias.ts";
import MediaPreview from "@islands/collection/MediaPreview.tsx";

export default function CollectionTile({
  media,
  mediaClick,
}: {
  media: Image | Video | Audio | Misc;
  mediaClick?: (media: Image | Video | Audio | Misc) => void;
}) {
  const [active, setActive] = useState(false);

  const specialType = media.type === MediaType.Misc || media.type === MediaType.Audios;
  const activeBtnStyle = specialType
    ? "flex-col absolute justify-center items-start gap-[3px] inline-flex bg-background h-full top-0 left-full px-2 rounded-bl"
    : "absolute items-start gap-[3px] inline-flex bg-background top-0 right-0 p-2 rounded-bl";

  return (
    <>
      <div className={`relative ${specialType && "w-fit"}`}>
        <div onClick={() => mediaClick && mediaClick(media)}>
          <MediaPreview media={media} from={"collection"} />
        </div>
        <button className={activeBtnStyle} onClick={() => setActive(true)}>
          {Array.from({ length: 3 }).map(() => (
            <span className={`block w-2 h-2 bg-background rounded-full border-2 border-text`}></span>
          ))}
        </button>
      </div>
      <InpagePopup isOpen={active} closePopup={() => setActive(false)}>
        <MediaDetail media={media} />
      </InpagePopup>
    </>
  );
}
