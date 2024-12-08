import PlatformLinksBubble from "@islands/Bricks/Common/PlatformLinksBubble.tsx";
import Player from "@islands/Player/index.tsx";
import Link from "@islands/UI/Link.tsx";
import { AudioBrick as AudioType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { useMemo } from "preact/hooks";

type AudioProps = {
  content: AudioType;
  size?: { width: number; height: number };
};

export default function Audio({ content, size }: AudioProps) {
  const transitionsStyles = "transition-all ease-in-out duration-500";

  const isSmallSize = useMemo(() => (size?.height ?? 200) < 200, [size?.height]);

  const renderMedia = useMemo(() => {
    if (content.media) {
      if (content.media.extension?.includes("video")) {
        return (
          <Player
            type="video"
            src={content.media.public_src ?? ""}
            autoplay
            disableControls
            additionnalConfig={{ controlOnHover: true }}
            loopVideo
            muted
            sx={cn("rounded-md [&_#volbar]:w-[50px]", transitionsStyles)}
          />
        );
      }
      if (content.media.extension?.includes("image")) {
        return <img className={cn("rounded-md object-cover w-full h-full")} src={content.media?.public_src} alt={content.media?.alt} />;
      }
    }
    return <div className={cn("rounded-md object-cover w-full h-full bg-main")}></div>;
  }, [JSON.stringify(content.media)]);

  return (
    <div
      data-hover-card
      className={cn("group/main w-full h-full rounded-[20px] relative flex flex-col justify-between", isSmallSize ? "p-2 gap-1" : "p-5 gap-4")}
    >
      {/* Backdrop */}
      {content.media?.extension?.includes("image") && (
        <img
          className={cn("absolute top-0 left-0 w-full h-full rounded-[20px] object-cover pointer-events-none", "opacity-20 blur-md")}
          src={content.media?.public_src}
          alt={content.media?.alt}
        />
      )}

      {/* Audio content */}
      <div className={"flex gap-3 min-h-0"}>
        <div className={"max-w-[120px] max-h-[120px] h-full w-auto aspect-square"}>{renderMedia}</div>
        <div className={cn("flex flex-col justify-start items-start min-w-0", isSmallSize ? "gap-1 w-3/4" : "py-2 gap-3")}>
          <p className={cn("text-text font-semibold w-full", isSmallSize && "truncate")} title={content.track.name}>
            {content.track.name}
          </p>
          <div className={"text-text_grey text-[12px] font-semibold flex gap-1 w-full"}>
            {content.track.artist?.map((artist) => (
              <a className={"hover:underline"} href={artist.url} target={"_blank"}>
                {artist.name}
              </a>
            ))}
          </div>
          <Link href={content.link} className={"mt-auto"}>
            {content.link}
          </Link>
        </div>
      </div>

      {/* Platforms links */}
      <div className={cn("absolute", isSmallSize ? "top-1 right-1" : "top-3 right-3")}>
        <PlatformLinksBubble platforms={content.track.platforms} forceMobile />
      </div>

      {/* Audio player */}
      <div className={"w-full min-h-fit"}>
        <Player type="audio" src={content.audio.public_src ?? ""} />
      </div>
    </div>
  );
}
