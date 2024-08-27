import { Album as AlbumType, Track } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { IconArrowDownRight, IconArrowUpRight } from "@utils/icons.ts";
import { useCallback, useState } from "preact/hooks";

type AlbumProps = {
  content: AlbumType;
};

// TODO: calculate correct postion, or better dynamic positioning (impossible)
const trackPoses = new Map([
  [1, "top-[30%] left-[10%]"],
  [2, "top-[10%] left-[34%]"],
  [3, "top-[20%] left-[64%]"],
  [4, "top-[50%] left-[70%]"],
  [5, "top-[70%] left-[50%]"],
])

export default function Album({ content }: AlbumProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  // FIXME: gradient tests:
  // bg-gradient-to-b from-[#007BFF] to-[#114752]
  // bg-gradient-to-b from-[#7da7d9] to-[#313131]

  // TODO: animations
  // TODO: way to have overflow tracklist container with absolute platform hover (now ~7 tracks max)

  const toggleOpenState = useCallback(() => {
    if (content.platforms) setIsOpen((p) => !p);
  }, []);

  return (
    <div
      data-open={isOpen}
      className={"group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px]"}
      onMouseLeave={() => {
        if (isOpen) setIsOpen(false);
        if (isCreditsOpen) setIsCreditsOpen(false);
      }}
    >
      <img
        className={cn(
          "absolute rounded-[20px] group-hover/main:brightness-50 object-cover w-[calc(100%-2px)] h-[calc(100%-2px)]",
          isOpen ? "brightness-50" : "",
        )}
        src={content.media?.public_src}
        alt={content.media?.alt}
      />
      {(!isOpen && !isCreditsOpen) &&
        (
          <>
            <h2
              // TODO: font
              className={"hidden group-hover/main:block text-[20px] font-bold text-white text-center absolute pos-center cursor-pointer hover:underline"}
              onClick={toggleOpenState}
            >
              {content.title}
            </h2>
            <IconArrowDownRight
              className={"hidden group-hover/main:block absolute m-2 right-0 bottom-0 w-5 h-5 cursor-pointer"}
              color={"#202020"}
              onClick={() => setIsCreditsOpen((p) => !p)}
            />
          </>
        )}
      {isOpen && (
        <div
          className={"absolute p-7 flex flex-col gap-3 w-full h-full"}
        >
          {content.tracklist?.map((t) => <AlbumTrack track={t} />)}
        </div>
      )}
      {isCreditsOpen && (
        <div
          className={"absolute p-7 flex justify-around items-start w-full h-full"}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quod, quae quia cumque, quos, quas quidem sit voluptates quibusdam
          </p>
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
          {/* TODO: color */}
          <IconArrowUpRight className={"z-30 w-full h-full hover:text-text"} color={"#9c9c9c"} />
          <div
            className={"w-64 h-64 absolute bottom-[-5rem] left-[-5rem] rounded-full bg-[#000000b7] z-20 hidden group-hover/trackptfm:block"}
          >
            {track.platforms.map((pfl, i) =>
              pfl.platform.icon && trackPoses.get(i) &&
              (
                <a href={pfl.url} target="_blank" className={cn("w-fit h-fit flex absolute", trackPoses.get(i))}>
                  <img
                    className={"max-w-12 max-h-12	w-auto h-auto hover:drop-shadow-platformIcon"}
                    src={pfl.platform.icon}
                  />
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
