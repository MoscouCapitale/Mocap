import { Album as AlbumType, Track } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { IconArrowUpRight } from "@utils/icons.ts";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useCallback, useMemo, useState } from "preact/hooks";
import Video from "@islands/Video.tsx";
gsap.registerPlugin(TextPlugin);

type AlbumProps = {
  content: AlbumType;
};

const MAX_PLATFORMS = 8;

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
          <Video
            src={content.media.public_src ?? ""}
            // autoplay // TODO: is autoplay good ?
            additionnalConfig={{
              // delay: 2000,
              controlsTrigger: "bottom",
              disableSomeControls: ["volumeIcon", "duration"],
            }}
            loopVideo
            muted
            sx={cn(
              "absolute group-hover/main:brightness-50 rounded-[20px] [&_#volbar]:w-[50px]",
              isOpen ? "brightness-50" : "",
              transitionsStyles,
            )}
          />
        );
      } else if (content.media.extension?.includes("image")) {
        return (
          <img
            className={cn(
              "absolute rounded-[20px] group-hover/main:brightness-50 object-cover w-[calc(100%-2px)] h-[calc(100%-2px)]",
              isOpen ? "brightness-50" : "",
              transitionsStyles,
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
      data-open={isOpen}
      className={"group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px]"}
      onMouseLeave={() => {
        if (isOpen) setIsOpen(false);
      }}
    >
      {renderMedia}
      {(!isOpen) &&
        (
          <h2
            className={cn(
              "invisible group-hover/main:visible opacity-0 group-hover/main:opacity-100",
              "absolute pos-center cursor-pointer inline-block",
              "text-[20px] font-bold text-center text-text", // Font styles
              transitionsStyles,
            )}
            onClick={toggleOpenState}
          >
            {content.title}
          </h2>
        )}
      {isOpen && (
        <div
          className={"absolute p-7 flex flex-col gap-3 w-full h-full"}
        >
          {content.tracklist?.map((t) => <AlbumTrack track={t} />).slice(0, 7)}
        </div>
      )}
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
            <a
              className={"hover:underline"}
              href={artist.url}
              target={"_blank"}
            >
              {artist.name}
            </a>
          ))}
        </div>
      </div>
      {track.platforms && track.platforms.length > 0 && (
        <div className={"w-8 h-8 relative group/trackptfm"}>
          <IconArrowUpRight
            className={cn(
              "z-30 w-full h-full  text-text_grey transition-all ease-in-out duration-300",
              "translate-x-0 translate-y-0 group-hover/trackptfm:translate-x-[10%] group-hover/trackptfm:-translate-y-[10%]",
            )}
          />
          <div
            className={cn(
              "w-64 h-64 absolute bottom-[-300%] left-[-300%] rounded-full bg-[#000000b7] z-20", // Element is just placed at the tip of the arrow
              "invisible group-hover/trackptfm:visible opacity-0 group-hover/trackptfm:opacity-100 scale-0 group-hover/trackptfm:scale-100",
              "transition-all duration-300 ease-in-out",
            )}
          >
            {track.platforms.map((pfl, i) => {
              if (!pfl.platform.icon || i >= MAX_PLATFORMS) {
                return <></>;
              }
              const plNb = (track.platforms ?? []).length < MAX_PLATFORMS
                ? (track.platforms ?? []).length
                : MAX_PLATFORMS;
              return (
                <a
                  href={pfl.url}
                  target="_blank"
                  className={cn(
                    "w-12 h-12 flex absolute top-1/2 left-1/2 justify-center items-center",
                  )}
                  style={{
                    transform: "translate(60px, -50%)", // Place the element in-between the radius of the circle
                    transformOrigin: "0 0",
                    rotate: `${i * (360 / plNb)}deg`, // Place the element on the circle parent
                  }}
                >
                  <img
                    style={{ rotate: `${-1 * (i * (360 / plNb))}deg` }} // Set the element to be in the correct orientation (top up)
                    className={"max-w-full max-h-full w-auto h-auto hover:drop-shadow-platformIcon transition-all ease-in-out duration-500"}
                    src={pfl.platform.icon}
                  />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
