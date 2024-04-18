import { Media, Image, Video, Audio, Misc, MediaType } from "@models/Medias.ts";
import Button from "@islands/Button.tsx";

type MediaPreviewProps = {
  media: Media | Image | Video | Audio | Misc;
  from: "collection" | "detail";
};

export default function MediaPreview({ media, from }: MediaPreviewProps) {
  return (
    <>
      {from === "collection" && (
        <>
          {" "}
          {media.type === MediaType.Images && <img className={"h-full w-full object-cover max-h-[200px] rounded"} src={media.public_src} alt={media.alt} />}
          {media.type === MediaType.Videos && (
            <video className={"h-full w-full object-cover max-h-[200px] rounded"} controls>
              <source src={media.public_src} type="video/mp4" />
            </video>
          )}
          {media.type === MediaType.Audios && (
            <audio className={"h-[34px] w-full object-cover max-h-[200px] rounded"} controls>
              <source src={media.public_src} type="audio/mp3" />
            </audio>
          )}
          {media.type === MediaType.Misc && (
            <div className={"w-fit p-2 rounded bg-black text-text"}>
              {media.name}
              <Button
                text={"dl"}
                onClick={() => {
                  window.open(media.public_src);
                }}
              />
            </div>
          )}
        </>
      )}
      {from === "detail" && (
        <>
          {" "}
          {media.type === MediaType.Images && <img className={"h-full object-cover rounded"} src={media.public_src} alt={media.alt} />}
          {media.type === MediaType.Videos && (
            <video className={"h-full rounded"} controls>
              <source src={media.public_src} type="video/mp4" />
            </video>
          )}
          {media.type === MediaType.Audios && (
            <audio className={"w-full object-cover rounded"} controls>
              <source src={media.public_src} type="audio/mp3" />
            </audio>
          )}
          {media.type === MediaType.Misc && (
            <div className={"w-fit p-2 rounded bg-black text-text"}>
              {media.name}
              <Button
                text={"dl"}
                onClick={() => {
                  window.open(media.public_src);
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
