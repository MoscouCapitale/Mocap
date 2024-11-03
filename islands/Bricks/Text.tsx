import { Text as TextType } from "@models/Bricks.ts";
import MarkdownWrapper from "@components/UI/MarkdownWrapper.tsx";
import Video from "@islands/Video/index.tsx";

type TextProps = {
  content: TextType;
};

export default function Text({ content }: TextProps) {

  const backgroundImageSx = "absolute top-0 left-0 w-full h-full object-cover rounded-[20px] blur-md brightness-50";

  return (
    <div
      data-hover-card
      className={"group/main w-full h-full rounded-[20px]"}
    >
      <div className={"bg-black flex p-3 rounded-[20px] w-full h-full text-text relative overflow-hidden"}>
        {content.media?.extension?.includes("video") && (
          <Video
            src={content.media.public_src ?? ""}
            disabled
            sx={backgroundImageSx}
          />
        )}
        {content.media?.extension?.includes("image") && (
          <img
            className={backgroundImageSx}
            src={content.media.public_src}
          />
        )}
        <div
          className={"hide-scrollbar overflow-y-scroll z-[1] pr-3"}
          style={{
            mask: "linear-gradient(#fff0, #fff 10%), linear-gradient( #fff 90%, #0000 100%)",
            maskComposite: "intersect",
          }}
        >
          <MarkdownWrapper content={content.text} />
        </div>
      </div>
    </div>
  );
}
