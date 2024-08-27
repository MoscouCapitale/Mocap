import { HeroSection as HeroSectionType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";

type HeroSectionProps = {
  content: HeroSectionType;
};

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <div
      className={"group/main w-full h-full rounded-[20px] overflow-y-auto"}
    >
      {/* TODO: media rendered */}
      <img
        className={cn(
          "absolute rounded-[20px] group-hover/main:brightness-75 object-cover w-[calc(100%-2px)] h-[calc(100%-2px)]",
        )}
        src={content.media?.public_src}
        alt={content.media?.alt}
      />
      <a
        className={"hidden group-hover/main:block text-[20px] font-bold text-white text-center absolute pos-center cursor-pointerflex items-center justify-center"}
        // TODO: handle no link set
        href={content.cta?.url}
        target={"_blank"}
      >
        <h2
          // TODO: font
          className={"hover:underline"}
        >
          {content.title}
        </h2>
        {
          /* <IconArrowDownRight
          className={"hidden group-hover/main:block absolute m-2 right-0 bottom-0 w-5 h-5 cursor-pointer"}
          color={"#202020"}
          onClick={() => setIsCreditsOpen((p) => !p)}
        /> */
        }
      </a>
    </div>
  );
}
