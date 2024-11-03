import {
  Audio,
  Image,
  Media,
  MediaType,
  Misc,
  Video as VideoType,
} from "@models/Medias.ts";
import Button from "@islands/Button.tsx";
import Video from "@islands/Video/index.tsx";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { cn } from "@utils/cn.ts";

type MediaPreviewProps = {
  media: Media | Image | VideoType | Audio | Misc;
  /** Wheres the media comes from, changing its interactivity.
   *
   * - "collection": The media is displayed in a collection grid. You can only click on it, not interact with it.
   * - "detail": The media is displayed in a detail view. You can interact with it.
   */
  from: "collection" | "detail";
};

export default function MediaPreview(
  { media, from }: MediaPreviewProps,
) {
  type RenderedMediaProps = {
    media: Media | Image | VideoType | Audio | Misc;
    from: "collection" | "detail";
  };

  const RenderedMedia: React.FC<RenderedMediaProps> = useCallback(
    (
      { media, from }: RenderedMediaProps,
    ) => {
      switch (media.type) {
        case MediaType.Images:
          if (from === "collection") {
            return (
              <img
                className={"h-full w-full object-cover max-h-[200px] rounded"}
                src={media.public_src}
                alt={media.alt}
              />
            );
          } else {
            return (
              <img
                className={"h-full object-cover rounded"}
                src={media.public_src}
                alt={media.alt}
              />
            );
          }
        case MediaType.Videos:
          if (from === "collection") {
            return (
              <div className="relative h-full w-full max-h-[200px] rounded">
                <Video src={media.public_src ?? ""} disabled />
              </div>
            );
          } else {
            // TODO: make the Video component accept a media object (blob)
            if (media.public_src?.includes("blob")) {
              return (
                <video
                  className={cn(
                    "w-full h-full rounded",
                    (media as VideoType).object_fit === "contain"
                      ? "object-contain"
                      : "object-cover",
                  )}
                  src={media.public_src}
                  controls
                />
              );
            }
            return (
              <Video
                src={media.public_src ?? ""}
                sx={"h-full rounded"}
                autoplay={!!(media as VideoType).autoplay}
                fit={(media as VideoType).object_fit ?? "cover"}
                additionnalConfig={{
                  loader: false,
                }}
              />
            );
          }
        case MediaType.Audios:
          if (from === "collection") {
            return (
              <audio
                className={"h-[34px] w-full object-cover max-h-[200px] rounded"}
                controls
              >
                <source src={media.public_src} type="audio/mp3" />
              </audio>
            );
          } else {
            return (
              <audio className={"w-full object-cover rounded"} controls>
                <source src={media.public_src} type="audio/mp3" />
              </audio>
            );
          }
        case MediaType.Misc:
          if (from === "collection") {
            return (
              <div className={"w-fit p-2 rounded bg-black text-text"}>
                {media.name}
                <Button
                  onClick={() => {
                    globalThis.open(media.public_src);
                  }}
                >dl</Button>
              </div>
            );
          } else {
            return (
              <div className={"w-fit p-2 rounded bg-black text-text"}>
                {media.name}
                <Button
                  onClick={() => {
                    globalThis.open(media.public_src);
                  }}
                >dl</Button>
              </div>
            );
          }
      }
    },
    [
      media.name,
      (media as VideoType).object_fit,
      (media as VideoType).autoplay,
    ],
  );

  return <RenderedMedia media={media} from={from} />;
}
