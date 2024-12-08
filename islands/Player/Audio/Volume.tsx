import * as Slider from "@radix-ui/react-slider";
import { cn } from "@utils/cn.ts";
import { IconVolume, IconVolume2, IconVolume3 } from "@utils/icons.ts";
import { useEffect, useMemo, useState } from "preact/hooks";

type Positions = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type VolumeProps = {
  volume?: number;
  muted?: boolean;
  setVolume?: (volume: number) => void;
  setMuted?: (muted: boolean) => void;
  disabledIcon?: boolean;
  disabledSlider?: boolean;
  /** If the volume bar is static or displays on hover. On hover, bar will always be vertical. */
  variant?: "static" | "onhover";
  /** The orientation of the volume bar. */
  orientation?: "horizontal" | "vertical";
  width?: string;
};

type AudioState = {
  volume: number;
  muted: boolean;
};

export default function Volume({
  volume = 0.4,
  muted = false,
  setVolume,
  setMuted,
  disabledIcon,
  disabledSlider,
  variant = "static",
  orientation = "horizontal",
  width = "100px",
}: VolumeProps) {
  const [audioState, setAudioState] = useState<AudioState>({
    muted,
    volume,
  });

  const ICONS_SIZE = useMemo(() => 20, [variant]);

  useEffect(() => setVolume?.(audioState.volume), [audioState.volume]);
  useEffect(() => setMuted?.(audioState.muted), [audioState.muted]);

  const VolumeIcon = useMemo(() => {
    const props = {
      className: "text-text cursor-pointer",
      size: ICONS_SIZE,
      onClick: () =>
        setAudioState((p) => ({
          ...p,
          muted: !p.muted,
        })),
    };
    if (audioState.muted || audioState.volume == 0) {
      return <IconVolume3 {...props} />;
    } else if (!audioState.muted && audioState.volume < 0.5) {
      return <IconVolume2 {...props} />;
    } else return <IconVolume {...props} />;
  }, [audioState.muted, audioState.volume]);

  return (
    <div className={cn("flex items-center gap-2 group relative", variant === "onhover" && "group/volumewrapper flex-col")}>
      {!disabledIcon && VolumeIcon}
      {!disabledSlider && (
        <Slider.Root
          id={"volbar"}
          className={cn(
            "flex touch-none select-none items-center cursor-pointer",
            variant === "static" && "relative" && orientation === "horizontal" ? `h-5 w-[${width}]` : "h-[100px] w-5",
            variant === "onhover" &&
              "absolute bottom-[150%] flex-col order-first h-[70px] w-7 max-h-0 opacity-0 transition-all duration-500 ease-in-out group-hover/volumewrapper:max-h-[150px] group-hover/volumewrapper:opacity-100"
          )}
          defaultValue={[audioState.volume]}
          max={1}
          step={0.01}
          onValueChange={(volume: number) =>
            setAudioState((p) => ({
              ...p,
              volume,
              muted: volume === 0,
            }))
          }
          orientation={variant === "onhover" ? "vertical" : orientation}
        >
          <Slider.Track
            className={cn(
              "relative grow rounded-full bg-text_grey",
              orientation === "horizontal" ? "h-[3px]" : "w-[3px]",
              variant === "onhover" && orientation === "vertical" && "w-[5px]"
            )}
          >
            <Slider.Range
              className={cn("absolute rounded-full", audioState.muted ? "bg-text_grey" : "bg-text", orientation === "horizontal" ? "h-full" : "w-full")}
            />
          </Slider.Track>
        </Slider.Root>
      )}
    </div>
  );
}
