import ReactPlayer from "react-player";

type YoutubeEmbedProps = {
  link: string;
};

export default function YoutubeEmbed({ link }: YoutubeEmbedProps) {
  return (
    <>
      {/* @ts-ignore - Why ? */}
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        url={link}
        config={{
          youtube: {
            playerVars: {
              autoplay: 0,
              controls: 1,
              color: "white",
              loop: 1,
              rel: 0,
            },
          },
        }}
      />
    </>
  );
}
