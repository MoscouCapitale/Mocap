import { type HTMLAttributes } from "preact/compat";
import { cn } from "@utils/cn.ts";

interface AppleMusicProps extends HTMLAttributes<HTMLIFrameElement> {
  link: string;
  width?: number | string;
  height?: number | string;
  frameBorder?: number | string;
  allow?: string;
  sx?: string;
}

/** Simple AppleMusic embed component
 *
 */
export default function AppleMusicEmbed({ link, width = "100%", height = "100%", frameBorder = 0, allow = "encrypted-media", sx, ...props }: AppleMusicProps) {
  // match up everything after the album/
  const query = link.match(/album\/(.*)/)?.[1];

  return (
    <iframe
      className={cn("rounded-[20px]", sx)}
      title="AppleMusic Web Player"
      src={`https://embed.music.apple.com/fr/album/${query}`}
      frameBorder={frameBorder}
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
      width={width}
      height={height}
      allow={allow}
      {...props}
    />
  );
}
