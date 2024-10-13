import { Audio, Image, Media, MediaType, Misc, Video } from "@models/Medias.ts";
import Button from "@islands/Button.tsx";

type MediaPreviewProps = {
  media: Media | Image | Video | Audio | Misc;
  /** Wheres the media comes from, changing its interactivity.
   *
   * - "collection": The media is displayed in a collection grid. You can only click on it, not interact with it.
   * - "detail": The media is displayed in a detail view. You can interact with it.
   */
  from: "collection" | "detail";
};

export default function MediaPreview({ media, from }: MediaPreviewProps) {
  const RenderedMedia: React.FC<
    {
      media: Media | Image | Video | Audio | Misc;
      from: "collection" | "detail";
    }
  > = ({ media, from }) => {
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
              {/* <video className={"h-full w-full object-cover rounded"} controls> */}
                <video
                  slot="media"
                  src={media.public_src}
                  controls={false}
                  autoPlay={false}
                  muted
                  loop
                  className={'pointer-events-none'}
                >
                </video>
            </div>
          );
        } else {
          return (
            <video className={"h-full rounded"} controls>
              <source src={media.public_src} type="video/mp4" />
            </video>
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
                text={"dl"}
                onClick={() => {
                  globalThis.open(media.public_src);
                }}
              />
            </div>
          );
        } else {
          return (
            <div className={"w-fit p-2 rounded bg-black text-text"}>
              {media.name}
              <Button
                text={"dl"}
                onClick={() => {
                  globalThis.open(media.public_src);
                }}
              />
            </div>
          );
        }
    }
  };

  return <RenderedMedia media={media} from={from} />;
}
