import MediaDetail from "@islands/collection/MediaDetail.tsx";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import { ContextualDots } from "@islands/UI";
import { Audio, Image, MediaType, Misc, Video } from "@models/Medias.ts";
import { useState } from "preact/hooks";
import Button from "../UI/Button.tsx";

export default function CollectionTile({
  media,
  mediaClick,
}: {
  media: Image | Video | Audio | Misc;
  mediaClick?: (media: Image | Video | Audio | Misc) => void;
}) {
  const [active, setActive] = useState(false);

  const specialType = media.type === MediaType.Misc ||
    media.type === MediaType.Audios;
  const activeBtnStyle = specialType
    ? "flex-col absolute justify-center items-start gap-[3px] inline-flex bg-background h-full top-0 left-full px-2 rounded-bl"
    : "absolute items-start gap-[3px] inline-flex bg-background top-0 right-0 p-2 rounded-bl";

  return (
    <>
      <div
        className={`relative ${
          specialType && "w-fit"
        } flex flex-col items-start gap-1`}
      >
        <MediaPreview media={media} from={"collection"} />
        {mediaClick
          ? (
            <Button
              variant="secondary"
              onClick={() => mediaClick(media)}
            >Select</Button>
          )
          : <ContextualDots onClick={() => setActive(true)} />}
      </div>
      <InpagePopup isOpen={active} closePopup={() => setActive(false)}>
        <MediaDetail media={media} />
      </InpagePopup>
    </>
  );
}
