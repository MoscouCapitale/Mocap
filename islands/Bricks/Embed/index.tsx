import { EmbedConfig, EmbedTargets } from "@models/Embed.ts";
import { useMemo } from "preact/hooks";
import AppleMusicEmbed from "./AppleMusic.tsx";
import DeezerEmbed from "./Deezer.tsx";
import InstagramEmbed from "./Instagram.tsx";
import SoundcloudEmbed from "./Soundcloud.tsx";
import SpotifyEmbed from "./Spotify.tsx";
import YoutubeEmbed from "./Youtube.tsx";

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
      case "deezer":
        return <DeezerEmbed link={link} height={config?.height} />;
      case "apple-music":
        return <AppleMusicEmbed link={link} height={config?.height} />;
      case "instagram":
        return <InstagramEmbed link={link} height={config?.height} />;
      default:
        return null;
    }
  }, [target, config]);

  return embedContent
    ? (
      <>
        <div className="absolute inset-0 w-full h-full pointer-events-none"></div>
        {embedContent}
      </>
    )
    : null;
}

// FIXME: better way to detect the embed target
export const getEmbedTargetFromLink = (link: string): EmbedTargets | null => {
  if (link.includes("music.apple")) return "apple-music";
  if (link.includes("youtube")) return "youtube";
  if (link.includes("spotify")) return "spotify";
  if (link.includes("soundcloud")) return "soundcloud";
  if (link.includes("deezer")) return "deezer";
  if (link.includes("instagram")) return "instagram";

  return null;
};
