import { cn } from "@utils/cn.ts";
import { type HTMLAttributes } from "preact/compat";

interface InstagramProps extends HTMLAttributes<HTMLIFrameElement> {
  link: string;
  width?: number | string;
  height?: number | string;
  frameBorder?: number | string;
  allow?: string;
  sx?: string;
}

/** Simple Instagram embed component
 *
 */
export default function InstagramEmbed({ link, width = "100%", height = "100%", frameBorder = 0, allow = "encrypted-media", sx, ...props }: InstagramProps) {
  const url = new URL(link);
  // ex https://www.instagram.com/p/DF-17G6M_/?utm_source=ig_web_copy_link  . remove query params, and add /embed after the post id
  const frameSrc = `${url.origin}${url.pathname}embed`;

  return (
    <iframe
      className={cn("rounded-[20px]", sx)}
      title="Insta Web Player"
      src={frameSrc}
      frameBorder={frameBorder}
      width={width}
      height={height}
      frameborder="0"
      allow={allow}
      allowTransparency
      scrolling={"no"}
      {...props}
    />
  );
}
