import { availBricks, BricksType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import Player from "@islands/Player/index.tsx";
import { getEmbedTargetFromLink } from "@islands/Bricks/Embed/index.tsx";
import { LabeledToolTip } from "@islands/UI/Tooltip.tsx";

type PlaceholderProps = {
  type: BricksType;
  content: availBricks;
  nodeId: string;
};

const disabledStyle = "pointer-events-none brightness-50 grayscale [&_*]:pointer-events-none [&_*]:brightness-50 [&_*]:grayscale";

export default function Placeholder({ type, content, nodeId }: PlaceholderProps) {
  const renderedContent = () => {
    switch (type) {
      case BricksType.Text:
        return (
          <div className={cn("bg-black flex p-3 rounded-[20px] w-full h-full text-text", disabledStyle)}>
            {/* @ts-ignore - this is a Text brick */}
            <p className={"overflow-hidden"}>{content.text}</p>
          </div>
        );
      case BricksType.Platform_Link:
        return (
          <div
            className={cn("w-full h-full rounded-[20px] flex justify-center items-center text-[24px] text-text bg-background overflow-hidden", disabledStyle)}
          >
            <p className={"blur-[2px]"}>
              {/* @ts-ignore - this is a PlatformLink brick */}
              {content.platform.name}
            </p>
          </div>
        );
      default:
        // @ts-ignore - content is not a PlatformLink nor Text
        if (content.media) {
          // @ts-ignore - content is not a PlatformLink nor Text
          if (content.media.extension?.includes("video")) {
            return (
              <Player
                type="video"
                // @ts-ignore - content is not a PlatformLink nor Text
                src={content.media.public_src ?? ""}
                disabled
                sx={cn("rounded-[20px]", disabledStyle)}
              />
            );
            // @ts-ignore - content is not a PlatformLink nor Text
          } else if (content.media.extension?.includes("image")) {
            return (
              <img
                className={cn("w-full h-full object-cover rounded-[20px]", disabledStyle)}
                // @ts-ignore - this is a default brick
                src={content.platform?.icon ?? content.media?.public_src}
              />
            );
          }
        }
    }

    return (
      <div className={"w-full h-full rounded-[20px] flex justify-center items-center text-text overflow-hidden relative"}>
        <img className={"absolute pos-center w-full h-full object-cover"} src="/assets/gradients/001.webp" />
        {content.type === BricksType.Highlight && getEmbedTargetFromLink(content.link ?? "") && (
          <LabeledToolTip
            sx={"absolute pos-center text-text whitespace-nowrap"}
            label={`Intégration ${getEmbedTargetFromLink(content.link ?? "")}`}
            text="Activer la preview pour voir le contenu"
          />
        )}
      </div>
    );
  };

  return (
    <div id={"mcanva-article-placeholder"} data-node-id={nodeId} data-hover-card className={cn("group/main w-full h-full rounded-[20px]")}>
      {/* <div className={"absolute inset-0 w-full h-full pointer-events-none"}></div> */}
      {renderedContent()}
    </div>
  );
}
