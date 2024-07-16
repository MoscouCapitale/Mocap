import { Single as SingleType } from "@models/Bricks.ts";

type SingleProps = {
  content: SingleType;
};

export default function Single({ content }: SingleProps) {
  return (
    <div className={"w-full h-full rounded-[20px]"}>
      <img
        className="w-full h-full"
        src={content.media?.public_src}
        alt={content.media?.alt}
      />
    </div>
  );
}
