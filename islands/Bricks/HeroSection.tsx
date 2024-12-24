import { HeroSection as HeroSectionType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import Player from "@islands/Player/index.tsx";
import { IconArrowUpRight } from "@utils/icons.ts";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimationConfig } from "@utils/bricks.tsx";
gsap.registerPlugin(ScrollTrigger);

type HeroSectionProps = {
  content: HeroSectionType;
  asMainHeroSection?: boolean;
  disableAnimations?: boolean;
  animateConfig?: AnimationConfig;
};

// Add a deadzone to avoid that, at the end of the animation, the brick is not fully "set" (because to view it you kinda have to scroll just enough to set the animation backwards)
const ANIMATION_Y_DEADZONE = 100;

export default function HeroSection(
  {
    content,
    asMainHeroSection: initialAsMainHeroSection,
    disableAnimations = false,
    animateConfig,
  }: HeroSectionProps,
) {
  const ContainerRef = useRef<HTMLDivElement>(null);
  const [asMainHeroSection, setAsMainHeroSection] = useState(
    !!initialAsMainHeroSection,
  );

  //TODO: populate objectfit (maybe from localstroage, because this a global element ?)
  //TODO: add ghosting effect on the animation

  const renderMedia = useMemo(() => {
    if (content.media) {
      if (content.media.extension?.includes("video")) {
        return (
          <Player
            type={"video"}
            src={content.media.public_src ?? ""}
            autoplay={asMainHeroSection}
            additionnalConfig={{
              delay: asMainHeroSection ? 1200 : undefined,
              controlOnHover: true,
              disablePauseOnHover: asMainHeroSection,
              volumeControl: "bottom-right",
            }}
            loopVideo
            disableControls
            sx={"z-10"}
          />
        );
      } else if (content.media.extension?.includes("image")) {
        return (
          <img
            className={cn(
              "absolute object-cover w-full h-full",
              asMainHeroSection ? "rounded-none" : "rounded-[20px]",
            )}
            src={content.media?.public_src}
            alt={content.media?.alt}
          />
        );
      } else return null;
    } else return null;
  }, [content, asMainHeroSection]);

  const mainSectionTransitions = `duration-2000 delay-500`;

  // If the HeroSection is the main one (initially), then set toggle this state, to apply styling changes where not in main anymore
  const onAnimationProgress = useCallback(
    (obj: any) => {
      const { progress } = obj;
      if (initialAsMainHeroSection) {
        setAsMainHeroSection((p) => {
          if (progress >= 0.5 && p) return false;
          if (progress < 0.5 && !p) return true;
          return p;
        });
      }
    },
    [asMainHeroSection],
  );

  useEffect(() => {
    if (!ContainerRef.current || disableAnimations || !animateConfig) return;

    let tween: any;
    switch (content.style) {
      case "scrolling-hero": {
        tween = gsap.to(ContainerRef.current, {
          x: animateConfig.x,
          y: animateConfig.y,
          width: animateConfig.width,
          height: animateConfig.height,
          borderRadius: "20px",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ContainerRef.current,
            start: "bottom 90%",
            end: animateConfig.y - ANIMATION_Y_DEADZONE,
            scrub: true,
            onUpdate: onAnimationProgress,
            invalidateOnRefresh: true,
          },
        });
        break;
      }
      default:
    }

    return () => {
      tween.scrollTrigger.kill();
    };
  }, [animateConfig]);

  return (
    <div
      ref={ContainerRef}
      className={cn(
        "group/main w-full h-full overflow-y-auto",
        asMainHeroSection ? "rounded-none" : "rounded-[20px]",
      )}
      data-hover-card={!asMainHeroSection}
      style={animateConfig && {
        "--offset-x": `${animateConfig.x}px`,
        "--offset-y": `${animateConfig.y}px`,
      }}
    >
      <div
        className={cn(
          "w-full h-full brightness-75 group-hover/main:brightness-[0.4] transition-all ease-in-out relative",
          asMainHeroSection ? mainSectionTransitions : ``,
        )}
      >
        {asMainHeroSection &&
          (
            <img
              src="/assets/gradients/001.webp"
              loading={"lazy"}
              className={cn(
                "absolute inset-0 w-full h-full object-cover z-20",
                "group-hover/main:opacity-80 opacity-0 transition-opacity ease-in-out",
                "pointer-events-none",
                mainSectionTransitions,
              )}
            />
          )}
        {/* Media */}
        {renderMedia}
      </div>
      <a
        className={cn(
          "invisible group-hover/main:visible opacity-0 group-hover/main:opacity-100 group/title absolute pos-center cursor-pointerflex items-center justify-center transition-all ease-in-out",
          asMainHeroSection ? mainSectionTransitions : "duration-500",
        )}
        href={content.cta?.url ?? "#"}
        target={"_blank"}
      >
        <h2
          style={{ "--title-subcontent": `'${content.subtitle ?? ""}'` }}
          className={cn(
            "inline-block whitespace-nowrap transition-all ease-in-out relative text-text font-bold",
            "after:content-[var(--title-subcontent)]",
            asMainHeroSection ? "text-clamp" : "text-4xl md:text-[20px]",
            content.subtitle
              ? `after:absolute after:top-full after:left-0 after:max-w-0 after:inline-block [&:after]:text-text_grey after:text-3xl md:after:text-clamp-sm after:overflow-hidden group-hover/main:after:max-w-screen-2xl md:group-hover/title:after:max-w-screen-2xl after:duration-3000`
              : `after:w-0 after:h-[2px] after:block after:bg-text group-hover/main:after:w-full md:group-hover/title:after:w-full after:duration-500`,
          )}
        >
          {content.title ?? ""}
        </h2>
        <IconArrowUpRight
          className={cn(
            "invisible opacity-0 cursor-pointer absolute left-full bottom-0 text-text_grey hover:text-text",
            "group-hover/main:visible group-hover/main:opacity-100 md:group-hover/title:visible md:group-hover/title:opacity-100",
            " translate-x-0 translate-y-0", // Special effect on hover
            "group-hover/main:translate-x-[10%] group-hover/main:-translate-y-[10%] md:group-hover/title:translate-x-[10%] md:group-hover/title:-translate-y-[10%]",
            asMainHeroSection ? "w-[clamp(1rem,10vw,4rem)] h-[clamp(1rem,10vw,4rem)]" : "w-12 h-12 md:w-8 md:h-8",
          )}
          style={{ // Only delay the translation
            transition:
              "transform 0.5s ease-in-out 0.2s, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out, color 0.2s ease-in-out",
          }}
        />
      </a>
    </div>
  );
}
