import { Text as TextType } from "@models/Bricks.ts";

type TextProps = {
  content: TextType;
};

export default function Text({ content }: TextProps) {

  // TODO: use placeholder backgrounds ?
  // TODO: md support
  // TODO: custom scrollbar

  return (
    <div
      className={"group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px]"}
    >
      <div className={"bg-black flex p-3 rounded-[20px] w-full h-full text-text z-30"}>
        <p className={"scrollbar scrollbar-thumb-text scrollbar-track-black overflow-y-scroll"}>{content.text}</p>
      </div>
    </div>
  );
}
