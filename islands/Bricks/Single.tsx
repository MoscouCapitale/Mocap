import Video from "@islands/Video/index.tsx";
import { Single as SingleType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { useCallback, useMemo, useState } from "preact/hooks";

type SingleProps = {
  content: SingleType;
};

export default function Single({ content }: SingleProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            autoplay
            additionnalConfig={{
              delay: 2000,
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
              "absolute rounded-[20px] group-hover/main:brightness-50 object-cover w-full h-full",
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
      {(!isOpen) &&
        (
          <>
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
          </>
        )}
      {isOpen && (
        <div
          className={"absolute inset-0 p-14 grid justify-items-center content-between"}
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {content.track.platforms?.map((pfl) => {
            console.log(`platform ${pfl.name}: `, pfl);
            if (pfl.platform.icon) {
              return (
                <a
                  href={pfl.url}
                  target="_blank"
                  className={cn(
                    "w-12 h-12 flex justify-center items-center",
                  )}
                >
                  <img
                    className={"max-w-full max-h-full w-auto h-auto hover:drop-shadow-platformIcon transition-all ease-in-out duration-500"}
                    src={pfl.platform.icon}
                  />
                </a>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
