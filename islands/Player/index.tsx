import { JSX as JSXInternal } from "preact";
import AudioPlayer, { AudioProps } from "./Audio/index.tsx";
import VideoPlayer, { VideoProps } from "./Video/index.tsx";

type AudioPlayerProps = AudioProps & { type: "audio" };
type VideoPlayerProps = VideoProps & { type: "video" };

/** Mapper component for audio and video players
 * 
 * @param param0 
 * @returns 
 */
export default function Player({ type, ...props }: AudioPlayerProps | VideoPlayerProps) {
  if (type === "audio") return <AudioPlayer {...props} />;
  else if (type === "video") return <VideoPlayer {...props} />;
  return null;
}
