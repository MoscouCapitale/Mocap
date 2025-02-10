import { type HTMLAttributes } from "preact/compat";
import { cn } from "@utils/cn.ts";

interface SpotifyProps extends HTMLAttributes<HTMLIFrameElement> {
  link: string;
  width?: number | string;
  height?: number | string;
  frameBorder?: number | string;
  allow?: string;
  sx?: string;
}

/** Simple Spotify embed component
 *
 * @see Heavily inspired from [react-spotify-embed](https://github.com/ctjlewis/react-spotify-embed) by [ctjlewis](https://github.com/ctjlewis)
 */
export default function SpotifyEmbed({ link, width = "100%", height = "100%", frameBorder = 0, allow = "encrypted-media", sx, ...props }: SpotifyProps) {
  const url = new URL(link);
  url.pathname = url.pathname.replace(/\/intl-\w+\//, "/");
  return (
    <iframe
      className={cn("rounded-[20px]", sx)}
      title="Spotify Web Player"
      src={`https://open.spotify.com/embed${url.pathname}`}
      frameBorder={frameBorder}
      width={width}
      height={height}
      allow={allow}
      {...props}
    />
  );
}
