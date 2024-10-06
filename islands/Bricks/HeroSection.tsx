import { HeroSection as HeroSectionType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";

type HeroSectionProps = {
  content: HeroSectionType;
  asMainHeroSection?: boolean;
};

export default function HeroSection(
  { content, asMainHeroSection }: HeroSectionProps,
) {
  console.log(
    "HeroSection",
    content,
    " asMainHeroSection: ",
    asMainHeroSection,
  );
  return (
    <div
      className={cn(
        "group/main w-full h-full overflow-y-auto",
        asMainHeroSection ? "rounded-none" : "rounded-[20px]",
      )}
    >
      {/* TODO: media rendered */}
      <img
        className={cn(
          "absolute group-hover/main:brightness-75 object-cover w-[calc(100%-2px)] h-[calc(100%-2px)]",
          asMainHeroSection ? "rounded-none" : "rounded-[20px]",
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
