import { type HTMLAttributes } from "preact/compat";
import ReactPlayer from "react-player";

interface SoundcloudProps extends HTMLAttributes<HTMLIFrameElement> {
  link: string;
  width?: number | string;
  height?: number | string;
}

/** Simple Soundcloud embed component
 *
 */
export default function SoundcloudEmbed({ link, width = "100%", height = "100%" }: SoundcloudProps) {
  return (
    <>
      {/* @ts-ignore - Why ? */}
      <ReactPlayer
        width={width}
        height={height}
        // Need to add the color to the url to make it work bc react-player issue https://github.com/cookpete/react-player/issues/321
        url={`${link}?color=007dff`}
        config={{
          soundcloud: {
            options: {
              auto_play: false,
              show_artwork: true,
              show_comments: false,
              show_playcount: false,
              show_user: true,
              sharing: false,
            },
          },
        }}
      />
    </>
  );
}
