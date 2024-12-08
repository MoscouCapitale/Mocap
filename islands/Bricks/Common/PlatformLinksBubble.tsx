import { PlatformLink } from "@models/Bricks.ts";
import { IconArrowUpRight } from "@utils/icons.ts";
import { cn } from "@utils/cn.ts";
import { useIsMobile } from "@hooks/useIsMobile.ts";

type PlatformLinksBubbleProps = {
  platforms?: PlatformLink[];
  forceMobile?: boolean;
};

const MAX_PLATFORMS = 8;

export default function PlatformLinksBubble({ platforms, forceMobile }: PlatformLinksBubbleProps) {
  const isMobile = forceMobile ?? useIsMobile();

  return platforms && platforms.length > 0 ? (
    <div className={"w-8 h-8 relative group/trackptfm"}>
      <IconArrowUpRight
        className={cn(
          "z-30 w-full h-full  text-text_grey transition-all ease-in-out duration-300",
          "translate-x-0 translate-y-0 group-hover/trackptfm:translate-x-[10%] group-hover/trackptfm:-translate-y-[10%]"
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-[#000000b7] z-20", // Element is just placed at the tip of the arrow
          "invisible group-hover/trackptfm:visible opacity-0 group-hover/trackptfm:opacity-100 scale-0 group-hover/trackptfm:scale-100",
          "transition-all duration-300 ease-in-out",
          isMobile ? "w-44 h-44 bottom-[-400%] left-[-400%]" : "w-64 h-64 bottom-[-300%] left-[-300%]"
        )}
      >
        {platforms.map((pfl, i) => {
          if (!pfl.platform.icon || i >= MAX_PLATFORMS) {
            return <></>;
          }
          const plNb = (platforms ?? []).length < MAX_PLATFORMS ? (platforms ?? []).length : MAX_PLATFORMS;
          return (
            <a
              href={pfl.url}
              target="_blank"
              className={cn(
                "flex absolute top-1/2 left-1/2 justify-center items-center",
                isMobile ? "w-8 h-8" : "w-12 h-12",
                isMobile ? "translate-x-[40px] -translate-y-1/2" : "translate-x-[60px] -translate-y-1/2" // Place the element in-between the radius of the circle
              )}
              style={{
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
  ) : null;
}
