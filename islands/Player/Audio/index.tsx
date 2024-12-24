import ReactPlayer from "react-player";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconVolume, IconVolume2, IconVolume3 } from "@utils/icons.ts";
import { cn } from "@utils/cn.ts";
import * as Slider from "@radix-ui/react-slider";
import Loader from "@components/UI/Loader.tsx";
import Volume from "./Volume.tsx";
import ky from "ky";

export type AudioProps = {
  src: string;
  additionnalConfig?: AdditionnalConfig;
  disabled?: boolean;
  disableControls?: boolean;
  loopAudio?: boolean;
  muted?: boolean;
  sx?: string;
};

type AudioControls = {
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
  disableSomeControls?: AvailableControls[];
  loader?: boolean;
};

type AvailableControls = "play" | "timeline" | "duration" | "volumeIcon" | "volumeBar";

const ICONS_SIZE = 20;
const TIMELINE_MULTIPLIER = 100;

export default function Audio({ src, disabled, additionnalConfig, disableControls, loopAudio, muted, sx }: AudioProps) {
  const playerRef = useRef<ReactPlayer>(null);

  const [audioState, setAudioState] = useState<AudioControls>({
    isReady: false,
    isInit: false,
    playing: false,
    muted: false,
    volume: 0.4,
    played: 0,
    seeking: false,
    Buffer: true,
    duration: 0,
    currentTime: 0,
  });

  useEffect(() => {
    ky.head(src).then((res) => {
      setAudioState((p) => ({
        ...p,
        isInit: true,
        error: res.status === 200 ? undefined : "Video not found",
      }));
    });
  }, []);

  const onDuration = (duration: number) => setAudioState((p) => ({ ...p, duration }));

  const onProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    setAudioState((p) => ({
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

  const setTimeline = useCallback(
    (time: number) => {
      if (playerRef?.current) playerRef.current.seekTo(time, "seconds");
    },
    [audioState.duration]
  );

  const canDisplayControl = useCallback(
    (el: AvailableControls) => {
      return !(additionnalConfig?.disableSomeControls ?? []).includes(el);
    },
    [additionnalConfig]
  );

  return (
    <div
      className={cn("relative group w-full h-full min-w-[100px]", sx)}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {audioState.isInit && audioState.error && (
        <div className={"absolute inset-0 flex justify-center items-center"}>
          <p className={"text-text underline"}>{audioState.error}</p>
        </div>
      )}

      {additionnalConfig?.loader !== false && audioState.isInit && !audioState.error && !audioState.isReady && (
        <div className={"w-full h-full flex justify-center items-center"}>
          <Loader />
        </div>
      )}

      {audioState.isInit && !audioState.error && (
        <>
          {/* @ts-ignore - Why ? */}
          <ReactPlayer
            ref={playerRef}
            className={cn("pointer-events-none")}
            controls={false}
            playing={audioState.playing}
            muted={audioState.muted}
            volume={audioState.volume}
            loop={!!loopAudio}
            url={src}
            width={0}
            height={0}
            progressInterval={200}
            onDuration={onDuration}
            onProgress={onProgress}
            onReady={() => setAudioState((p) => ({ ...p, isReady: true }))}
          />

          {/* Aduio controls */}
          {!disabled && !disableControls && audioState.isReady && (
            <div class={cn("w-full flex justify-between items-center gap-4")}>
              {/* Play/Pause */}
              {canDisplayControl("play") && (
                <div
                  onClick={() =>
                    setAudioState((p) => ({
                      ...p,
                      playing: !p.playing,
                    }))
                  }
                >
                  {audioState.playing ? (
                    <IconPlayerPauseFilled className={"text-text cursor-pointer"} size={ICONS_SIZE} />
                  ) : (
                    <IconPlayerPlayFilled className={"text-text cursor-pointer"} size={ICONS_SIZE} />
                  )}
                </div>
              )}
              {/* Timeline */}
              <div className={"flex items-center gap-2 grow"}>
                {canDisplayControl("timeline") && (
                  <Slider.Root
                    className="relative flex h-5 grow touch-none select-none items-center"
                    value={[audioState.currentTime]}
                    max={audioState.duration}
                    step={audioState.duration / TIMELINE_MULTIPLIER}
                    onValueChange={(v: number[]) => setTimeline(v[0])}
                  >
                    <Slider.Track className="relative h-[3px] grow rounded-full bg-text_grey cursor-pointer">
                      <Slider.Range className="absolute h-full rounded-full bg-text" />
                    </Slider.Track>
                    <Slider.Thumb className="block h-1 w-1 rounded-[10px] bg-text focus:outline-none cursor-pointer" aria-label="Volume" />
                  </Slider.Root>
                )}
                {canDisplayControl("duration") && (
                  <div>
                    <p className={"text-text font-semibold"}>{formatTime(audioState.duration - audioState.currentTime)}</p>
                  </div>
                )}
              </div>
              {/* Volume */}
              <Volume
                volume={audioState.volume}
                muted={audioState.muted}
                setVolume={(volume: number) => setAudioState((p) => ({ ...p, volume }))}
                setMuted={(muted: boolean) => setAudioState((p) => ({ ...p, muted }))}
                disabledIcon={!canDisplayControl("volumeIcon")}
                disabledSlider={!canDisplayControl("volumeBar")}
                variant="onhover"
                orientation="vertical"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
