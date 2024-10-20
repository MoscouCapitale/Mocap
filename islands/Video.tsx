import ReactPlayer from "react-player";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@utils/icons.ts";
import { cn } from "@utils/cn.ts";
import * as Slider from "@radix-ui/react-slider";
import Loader from "@components/UI/Loader.tsx";
import { MediaObjectFit } from "@models/Medias.ts";

type VideoProps = {
  src: string;
  autoplay?: boolean;
  additionnalConfig?: AdditionnalConfig;
  disabled?: boolean;
  rounded?: boolean;
  disableControls?: boolean;
  loopVideo?: boolean;
  muted?: boolean;
  fit?: MediaObjectFit;
  sx?: string;
};

type VideoControls = {
  playing: boolean;
  muted: boolean;
  volume: number;
  played: number;
  seeking: boolean;
  Buffer: boolean;
  duration: number;
  currentTime: number;
  isInit: boolean;
  isReady: boolean;
  error?: string;
};

type AdditionnalConfig = {
  delay?: number;
  controlOnHover?: boolean;
  disablePauseOnHover?: boolean;
  /** What is the part of the video triggering the controls poppup.
   *
   * - "full" : The controls will be triggered when the mouse is over the video
   * - "bottom" : The controls will be triggered when the mouse is over the bottom part of the video
   */
  controlsTrigger?: "full" | "bottom";
  disableSomeControls?: AvailableControls[];
  loader?: boolean;
};

type AvailableControls =
  | "play"
  | "timeline"
  | "duration"
  | "volumeIcon"
  | "volumeBar";

const ICONS_SIZE = 20;
const TIMELINE_MULTIPLIER = 100;

export default function Video(
  {
    src,
    autoplay = false,
    disabled,
    rounded,
    additionnalConfig,
    disableControls,
    loopVideo,
    muted,
    fit = "cover",
    sx,
  }: VideoProps,
) {
  const playerRef = useRef<ReactPlayer>(null);

  const [videoState, setVideoState] = useState<VideoControls>({
    isReady: false,
    isInit: false,
    playing: disabled
      ? false
      : additionnalConfig?.delay
      ? false
      : additionnalConfig?.controlOnHover
      ? false
      : autoplay, // If disabled is true, then the video will not play, it will just be a "thumbnail"
    muted: autoplay ?? muted, // If autoplay is true, then the video will be muted (Browsers ask for videos to be muted to autoplay)
    volume: 0.4,
    played: 0,
    seeking: false,
    Buffer: true,
    duration: 0,
    currentTime: 0,
  });

  useEffect(() => {
    fetch(src, { method: "HEAD" }).then((res) => {
      setVideoState((p) => ({
        ...p,
        isInit: true,
        error: res.status === 200 ? undefined : "Video not found",
      }));
    });
  }, []);

  useEffect(() => {
    if (additionnalConfig?.delay) {
      setTimeout(() => {
        setVideoState((p) => ({ ...p, playing: true }));
      }, Math.abs(additionnalConfig?.delay));
    }
  }, [additionnalConfig?.delay]);

  const onDuration = (duration: number) =>
    setVideoState((p) => ({ ...p, duration }));

  const onProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    setVideoState((p) => ({
      ...p,
      currentTime: playedSeconds,
    }));
  };

  const formatTime = useCallback((time: number) => {
    if (time === 0) return `0:00`;
    else {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
  }, []);

  const setTimeline = useCallback((time: number) => {
    if (playerRef?.current) playerRef.current.seekTo(time, "seconds");
  }, [videoState.duration]);

  const VolumeIcon = useMemo(() => {
    const props = {
      className: "text-text cursor-pointer",
      size: ICONS_SIZE,
      onClick: () =>
        setVideoState((p) => ({
          ...p,
          muted: !p.muted,
        })),
    };
    if (videoState.muted || videoState.volume == 0) {
      return <IconVolume3 {...props} />;
    } else if (!videoState.muted && videoState.volume < 0.5) {
      return <IconVolume2 {...props} />;
    } else return <IconVolume {...props} />;
  }, [videoState.muted, videoState.volume]);

  const canDisplayControl = useCallback((el: AvailableControls) => {
    return !(additionnalConfig?.disableSomeControls ?? []).includes(el);
  }, [additionnalConfig]);

  return (
    <div
      className={cn(
        "relative group overflow-hidden w-full h-full min-h-[100px] min-w-[100px]",
        rounded ? "rounded-[10px]" : "",
        sx,
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onMouseEnter={() => {
        if (additionnalConfig?.controlOnHover) {
          setVideoState((p) => ({ ...p, playing: true }));
        }
      }}
      onMouseLeave={() => {
        if (
          additionnalConfig?.controlOnHover &&
          !additionnalConfig?.disablePauseOnHover
        ) {
          setVideoState((p) => ({ ...p, playing: false }));
        }
      }}
    >
      {videoState.isInit && videoState.error && (
        <div className={"absolute inset-0 flex justify-center items-center"}>
          <p className={"text-text underline"}>{videoState.error}</p>
        </div>
      )}

      {additionnalConfig?.loader !== false && videoState.isInit && !videoState.error && !videoState.isReady && (
        <div className={"w-full h-full flex justify-center items-center"}>
          <Loader />
        </div>
      )}

      {videoState.isInit && !videoState.error && (
        <>
          {/* @ts-ignore - Why ? */}
          <ReactPlayer
            ref={playerRef}
            className={cn(
              "pointer-events-none",
              fit === "cover"
                ? "[&>video]:object-cover"
                : "[&>video]:object-contain", // Set the object-fit property of the video
            )}
            controls={false}
            playing={videoState.playing}
            muted={videoState.muted}
            volume={videoState.volume}
            loop={!!loopVideo}
            url={src}
            width={"100%"}
            height={"100%"}
            progressInterval={200}
            onDuration={onDuration}
            onProgress={onProgress}
            onReady={() => setVideoState((p) => ({ ...p, isReady: true }))}
          />

          {/* Video controls */}
          {!disabled && !disableControls && videoState.isReady && (
            <div
              className={cn(
                "absolute w-full bottom-0 group/trgzone",
                additionnalConfig?.controlsTrigger === "bottom"
                  ? "h-10"
                  : "h-full",
              )}
              // onMouseEnter={TriggerZoneHandler}
              // onMouseLeave={TriggerZoneHandler}
              onClick={(e) => e.preventDefault()}
            >
              <div
                class={cn(
                  "absolute bottom-0 left-0 w-full flex justify-between items-center gap-4 p-4",
                  "bg-[#131313] bg-clip-padding backdrop-filter backdrop-blur bg-opacity-70",
                  "transition-all duration-300 translate-y-full group-hover/trgzone:translate-y-0",
                )}
              >
                {/* Play/Pause */}
                {canDisplayControl("play") &&
                  (
                    <div
                      onClick={() =>
                        setVideoState((p) => ({
                          ...p,
                          playing: !p.playing,
                        }))}
                    >
                      {videoState.playing
                        ? (
                          <IconPlayerPauseFilled
                            className={"text-text cursor-pointer"}
                            size={ICONS_SIZE}
                          />
                        )
                        : (
                          <IconPlayerPlayFilled
                            className={"text-text cursor-pointer"}
                            size={ICONS_SIZE}
                          />
                        )}
                    </div>
                  )}
                {/* Timeline */}
                <div className={"flex items-center gap-2 grow"}>
                  {canDisplayControl("timeline") &&
                    (
                      <Slider.Root
                        className="relative flex h-5 grow touch-none select-none items-center"
                        value={[videoState.currentTime]}
                        max={videoState.duration}
                        step={videoState.duration / TIMELINE_MULTIPLIER}
                        onValueChange={(v: number[]) => setTimeline(v[0])}
                      >
                        <Slider.Track className="relative h-[3px] grow rounded-full bg-text_grey cursor-pointer">
                          <Slider.Range className="absolute h-full rounded-full bg-text" />
                        </Slider.Track>
                        <Slider.Thumb
                          className="block h-1 w-1 rounded-[10px] bg-text focus:outline-none cursor-pointer"
                          aria-label="Volume"
                        />
                      </Slider.Root>
                    )}
                  {canDisplayControl("duration") && (
                    <div>
                      <p className={"text-text font-semibold"}>
                        {formatTime(
                          videoState.duration - videoState.currentTime,
                        )}
                      </p>
                    </div>
                  )}
                </div>
                {/* Volume */}
                <div className={"flex items-center gap-2 group"}>
                  {canDisplayControl("volumeIcon") && VolumeIcon}
                  {canDisplayControl("volumeBar") &&
                    (
                      <Slider.Root
                        id={"volbar"}
                        className={cn(
                          "relative flex h-5 w-[100px] touch-none select-none items-center",
                        )}
                        defaultValue={[videoState.volume]}
                        max={1}
                        step={0.01}
                        onValueChange={(volume: number) =>
                          setVideoState((p) => ({
                            ...p,
                            volume,
                            muted: volume === 0,
                          }))}
                      >
                        <Slider.Track className="relative h-[3px] grow rounded-full bg-text_grey cursor-pointer">
                          <Slider.Range
                            className={cn(
                              "absolute h-full rounded-full",
                              videoState.muted ? "bg-text_grey" : "bg-text",
                            )}
                          />
                        </Slider.Track>
                        <Slider.Thumb
                          className="block h-1 w-1 rounded-[10px] bg-text focus:outline-none cursor-pointer"
                          aria-label="Volume"
                        />
                      </Slider.Root>
                    )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
