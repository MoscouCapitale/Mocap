import { availBricks, BricksType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";

type PlaceholderProps = {
  type: BricksType;
  content: availBricks;
  nodeId: string;
};

// TODO: do same placeholder style as bricks

export default function Placeholder(
  { type, content, nodeId }: PlaceholderProps,
) {
  const renderedContent = () => {
    switch (type) {
      case BricksType.Text:
        return (
          <div
            className={"bg-black flex p-3 rounded-[20px] w-full h-full text-text"}
          >
            {/* @ts-ignore - this is a Text brick */}
            <p className={"overflow-hidden"}>{content.text}</p>
          </div>
        );
      case BricksType.Platform_Link:
        return (
          <div
            className={"w-full h-full rounded-[20px] flex justify-center items-center text-[24px] text-text bg-background overflow-hidden"}
          >
            <p
              className={"blur-[2px]"}
            >
              {/* @ts-ignore - this is a PlatformLink brick */}
              {content.platform.name}
            </p>
          </div>
        );
      default:
        return (
          <img
            className={"w-full h-full object-cover rounded-[20px]"}
            // @ts-ignore - this is a default brick
            src={content.platform?.icon ?? content.media?.public_src}
          />
        );
    }
  };

  return (
    <div
      id={"mcanva-article-placeholder"}
      data-node-id={nodeId}
      className={cn(
        "group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px] [&_*]:pointer-events-none [&_*]:grayscale [&_*]:brightness-50")}
    >
      {renderedContent()}
    </div>
  );
}
