import { type HTMLAttributes } from "preact/compat";
import { cn } from "@utils/cn.ts";
import ky from "ky";
import { useEffect, useState } from "preact/hooks";

interface DeezerProps extends HTMLAttributes<HTMLIFrameElement> {
  link: string;
  width?: number | string;
  height?: number | string;
  frameBorder?: number | string;
  allow?: string;
  sx?: string;
}

interface DeezerEmbedResponse {
  version: string;
  type: string;
  cache_age: number;
  provider_name: string;
  provider_url: string;
  entity: string;
  id: number;
  url: string;
  author_name: string;
  title: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  width: number;
  height: number;
  html: string;
}

/** Simple Deezer embed component
 *
 */
export default function DeezerEmbed({
  link,
  width = "100%",
  height = "100%",
  frameBorder = 0,
  allow = "encrypted-media; clipboard-write",
  sx,
  ...props
}: DeezerProps) {
  const [embedLink, setEmbedLink] = useState<DeezerEmbedResponse>();

  useEffect(() => {
    if (!embedLink) {
      ky.get(`/api/brick/getEmbedLink?eUrl=${link}`)
        .json<DeezerEmbedResponse | null>()
        .then((data) => {
          if (data) setEmbedLink(data);
        });
    }
  }, [link]);

  return embedLink ? (
    <iframe
      className={cn("rounded-[20px]", sx)}
      title="Deezer Web Player"
      // The link can be extracted from the stringified html iframe in the response.html
      src={embedLink?.html.match(/src="([^"]+)"/)?.[1]}
      frameBorder={frameBorder}
      width={width}
      height={height}
      frameborder="0"
      allow={allow}
      allowTransparency
      {...props}
    />
  ) : (
    // Last resort fallback
    <span className="absolute inset-0 w-full h-full bg-background"></span>
  );
}
