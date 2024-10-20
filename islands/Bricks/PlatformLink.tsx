import { PlatformLink as PlatformLinkType } from "@models/Bricks.ts";
import { IconArrowUpRight } from "@utils/icons.ts";
import { cn } from "@utils/cn.ts";

type PlatformLinkProps = {
  content: PlatformLinkType;
  /**
   * The size index determines the size of the brick.
   * - 0: small
   * - 1: long
   *
   * defined in `@see {@link utils/bricks.getBrickFromBrickType}`
   */
  sizeIndex: number;
};

export default function PlatformLink(
  { content, sizeIndex }: PlatformLinkProps,
) {
  return (
    <div
      className={"group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px]"}
    >
      <a
        href={content.url}
        className={cn(
          "w-full h-full bg-black rounded-[20px] flex items-center justify-between",
          sizeIndex === 0 ? "p-4 hover:scale-105" : "p-3",
        )}
      >
        {sizeIndex === 0 && (
          <img
            className={"w-full h-full object-cover"}
            src={content.platform.icon}
            alt={content.platform.name}
          />
        )}
        {sizeIndex === 1 && (
          <>
            <p className={"text-white text-[24px] font-bold"}>
              {content.platform.name}
            </p>
            <IconArrowUpRight
              className={"translate-x-0 translate-y-0 group-hover/main:translate-x-[10%] group-hover/main:-translate-y-[10%] transition-transform ease-in-out duration-500"}
              color="white"
              size={40}
            />
          </>
        )}
      </a>
    </div>
  );
}
