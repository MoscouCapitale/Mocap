import { EmbedConfig, EmbedTargets } from "@models/Embed.ts";
import YoutubeEmbed from "@islands/Bricks/Embed/Youtube.tsx";
import SpotifyEmbed from "@islands/Bricks/Embed/Spotify.tsx";
import SoundcloudEmbed from "@islands/Bricks/Embed/Soundcloud.tsx";
import { useMemo } from "preact/hooks";

type EmbedProps = {
  link: string;
  config?: EmbedConfig;
};

export default function MediaEmbed({ link, config }: EmbedProps) {
  const target = useMemo(() => getEmbedTargetFromLink(link), [link]);

  const embedContent = useMemo(() => {
    switch (target) {
      case "youtube":
        return <YoutubeEmbed link={link} />;
      case "spotify":
        return <SpotifyEmbed link={link} height={config?.height} />;
      case "soundcloud":
        return <SoundcloudEmbed link={link} height={config?.height} />;
      default:
        return null;
    }
  }, [target, config]);

  return embedContent ? (
    <>
      <div className={"absolute inset-0 w-full h-full pointer-events-none"}></div>
      {embedContent}
    </>
  ) : null;
}

// FIXME: better way to detect the embed target
export const getEmbedTargetFromLink = (link: string): EmbedTargets | null => {
  if (link.includes("youtube")) return "youtube";
  if (link.includes("spotify")) return "spotify";
  if (link.includes("soundcloud")) return "soundcloud";
  return null;
};
