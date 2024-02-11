import { Media } from "@models/Medias.ts";
import { useState } from "preact/hooks";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import MediaDetail from "@islands/collection/MediaDetail.tsx";

export default function CollectionTile({ media }: { media: Media }) {
  const [active, setActive] = useState(false);
  return (
    <>
      <div onClick={() => setActive(true)}>
        <img className={"h-full object-cover"} src={media.public_src} alt={media.alt} />
      </div>
      {active && (
        <InpagePopup closePopup={() => setActive(false)}>
          <MediaDetail media={media} action="modify" />
        </InpagePopup>
      )}
    </>
  );
}
