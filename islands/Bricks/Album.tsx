import PlatformLinksBubble from "@islands/Bricks/Common/PlatformLinksBubble.tsx";
import Player from "@islands/Player/index.tsx";
import { Album as AlbumType, Track } from "@models/Bricks.ts";
import { getPlayerControlsFromMediaControls, getStyleFit, VideoControls } from "@models/Medias.ts";
import { cn } from "@utils/cn.ts";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useCallback, useMemo, useState } from "preact/hooks";
gsap.registerPlugin(TextPlugin);

type AlbumProps = {
  content: AlbumType;
};

export default function Album({ content }: AlbumProps) {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: way to have overflow tracklist container with absolute platform hover (now 7 tracks max (sliced map))
  // TODO: video controls are not working (timeline an volumebar)

  const toggleOpenState = useCallback(() => {
    if (content.platforms) setIsOpen((p) => !p);
  }, []);

  const transitionsStyles = "transition-all ease-in-out duration-500";

  const renderMedia = useMemo(() => {
    if (content.media) {
      if (content.media.extension?.includes("video")) {
        return (
          <Player
            type="video"
            src={content.media.public_src ?? ""}
            fit={content.mediaFit}
            autoplay={(content.controls as VideoControls)?.autoplay}
            additionnalConfig={{
              delay: (content.controls as VideoControls)?.autoplay ? 2000 : undefined,
              controlsTrigger: "bottom",
              disableSomeControls: content.controls ? getPlayerControlsFromMediaControls(content.controls as VideoControls) : ["volumeIcon", "duration"],
            }}
            loopVideo
            muted
            sx={cn("absolute group-hover/main:brightness-50 rounded-[20px] [&_#volbar]:w-[50px]", isOpen ? "brightness-50" : "", transitionsStyles)}
          />
        );
      } else if (content.media.extension?.includes("image")) {
        return (
          <img
            className={cn(
              "absolute rounded-[20px] group-hover/main:brightness-50 w-full h-full",
              isOpen ? "brightness-50" : "",
              getStyleFit(content.mediaFit),
              transitionsStyles
            )}
            src={content.media?.public_src}
            alt={content.media?.alt}
          />
        );
      } else return null;
    } else return null;
  }, [content, isOpen]);

  return (
    <div
      data-hover-card
      data-open={isOpen}
      className={"group/main w-full h-full rounded-[20px]"}
      tabIndex={0}
      onMouseLeave={() => {
        if (isOpen) setIsOpen(false);
      }}
      onBlur={() => {
        if (isOpen) setIsOpen(false);
      }}
    >
      {renderMedia}
      {!isOpen && (
        <h2
          className={cn(
            "invisible group-hover/main:visible opacity-0 group-hover/main:opacity-100",
            "absolute pos-center cursor-pointer inline-block",
            "text-[20px] font-bold text-center text-text", // Font styles
            transitionsStyles
          )}
          onClick={toggleOpenState}
        >
          {content.title}
        </h2>
      )}
      {isOpen && <div className={"absolute p-7 flex flex-col gap-3 w-full h-full"}>{content.tracklist?.map((t) => <AlbumTrack track={t} />).slice(0, 7)}</div>}
    </div>
  );
}

const AlbumTrack = ({ track }: { track: Track }) => {
  return (
    <div className={"flex w-full items-center gap-3"}>
      <div className={"flex flex-col justify-center items-start grow"}>
        <p className={"text-text font-semibold"}>{track.name}</p>
        <div className={"text-text_grey text-[12px] font-semibold flex gap-1"}>
          {track.artist?.map((artist) => (
            <a className={"hover:underline"} href={artist.url} target={"_blank"}>
              {artist.name}
            </a>
          ))}
        </div>
      </div>
      <PlatformLinksBubble platforms={track.platforms} />
    </div>
  );
};
