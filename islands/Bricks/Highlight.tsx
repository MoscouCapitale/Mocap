import Player from "@islands/Player/index.tsx";
import { Highlight as HighlightType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { IconArrowUpRight } from "@utils/icons.ts";
import { useMemo, useRef } from "preact/hooks";
import MediaEmbed, { getEmbedTargetFromLink } from "@islands/Bricks/Embed/index.tsx";

type HighlightProps = {
  content: HighlightType;
  size?: { width: number; height: number };
};

export default function Highlight({ content, size }: HighlightProps) {
  const isEmbed = useMemo(() => content.link && getEmbedTargetFromLink(content.link), [content.link]);

  const renderMedia = useMemo(() => {
    if (isEmbed) return <MediaEmbed link={content.link ?? ""} config={size ? { width: size.width, height: size.height } : {}} />;

    if (content.media) {
      if (content.media.extension?.includes("video")) {
        return <Player type="video" src={content.media.public_src ?? ""} autoplay loopVideo additionnalConfig={{ controlOnHover: true }} sx={"z-10"} />;
      } else if (content.media.extension?.includes("image")) {
        return (
          <img
            className={cn("absolute group-hover/main:brightness-75 object-cover w-full h-full rounded-[20px]")}
            src={content.media?.public_src}
            alt={content.media?.alt}
          />
        );
      } else return null;
    }

    return null;
  }, [content.media]);

  return (
    <div data-hover-card-embed={isEmbed} data-hover-card={!isEmbed} className={cn("group/main w-full h-full overflow-y-auto rounded-[20px] overflow-hidden")}>
      <div className={cn("w-full h-full transition-all ease-in-out relative", isEmbed ? "" : "brightness-75 group-hover/main:brightness-[0.4] ")}>
        {/* Media */}
        {renderMedia}
      </div>
      {!isEmbed && (
        <a
          className={cn(
            "invisible group-hover/main:visible opacity-0 group-hover/main:opacity-100 group/title absolute pos-center max-w-full cursor-pointerflex items-center justify-center transition-all ease-in-out duration-500",
            content.link ? "cursor-pointer" : "cursor-default min-w-[80%] text-justify"
          )}
          href={content.link ?? "#"}
          target={"_blank"}
        >
          <h2
            style={{ "--title-subcontent": `'${content.subtitle ?? ""}'` }}
            className={cn(
              "inline-block transition-all ease-in-out relative text-text font-bold text-[20px]",
              "after:content-[var(--title-subcontent)]",
              "after:absolute after:top-full after:left-0 after:inline-block [&:after]:text-text_grey after:text-clamp-sm after:overflow-hidden max-w-screen-2xl"
            )}
          >
            {content.title}
          </h2>
          {content.link && (
            <IconArrowUpRight
              className={cn(
                "invisible group-hover/title:visible opacity-0 group-hover/title:opacity-100 cursor-pointer absolute left-full bottom-0 text-text_grey hover:text-text",
                " translate-x-0 translate-y-0 group-hover/title:translate-x-[10%] group-hover/title:-translate-y-[10%] w-8 h-8" // Special effect on hover
              )}
              style={{
                // Only delay the translation
                transition: "transform 0.5s ease-in-out 0.2s, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out, color 0.2s ease-in-out",
              }}
            />
          )}
        </a>
      )}
    </div>
  );
}
