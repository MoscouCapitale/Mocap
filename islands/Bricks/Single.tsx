import { Single as SingleType } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { IconArrowDownRight } from "@utils/icons.ts";
import { useCallback, useState } from "preact/hooks";

type SingleProps = {
  content: SingleType;
};

export default function Single({ content }: SingleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  // FIXME: gradient tests:
  // bg-gradient-to-b from-[#007BFF] to-[#114752]
  // bg-gradient-to-b from-[#7da7d9] to-[#313131]

  const toggleOpenState = useCallback(() => {
    if (content.platforms) setIsOpen((p) => !p);
  }, []);

  return (
    <div
      data-open={isOpen}
      className={"group/main w-full h-full p-[1px] bg-gradient-to-b from-[#7da7d9] to-[#313131] rounded-[20px] overflow-y-auto"}
      onMouseLeave={() => {
        if (isOpen) setIsOpen(false);
        if (isCreditsOpen) setIsCreditsOpen(false);
      }}
    >
      <img
        className={cn(
          "absolute rounded-[20px] group-hover/main:brightness-50 object-cover w-[calc(100%-2px)] h-[calc(100%-2px)]",
          isOpen ? "brightness-50" : "",
        )}
        src={content.media?.public_src}
        alt={content.media?.alt}
      />
      {(!isOpen && !isCreditsOpen) &&
        (
          <>
            <h2
              // TODO: font
              className={"hidden group-hover/main:block text-[20px] font-bold text-white text-center absolute pos-center cursor-pointer hover:underline"}
              onClick={toggleOpenState}
            >
              {content.title}
            </h2>
            <IconArrowDownRight
              className={"hidden group-hover/main:block absolute m-2 right-0 bottom-0 w-5 h-5 cursor-pointer"}
              color={"#202020"}
              onClick={() => setIsCreditsOpen((p) => !p)}
            />
          </>
        )}
      {isOpen && (
        <div
          className={"absolute inset-0 p-14 flex justify-around items-start"}
        >
          {content.track.platforms?.map((pfl) => {
            console.log(`platform ${pfl.name}: `, pfl);
            if (pfl.platform.icon) {
              return (
                <a href={pfl.url} target="_blank" className={"w-fit h-fit"}>
                  <img
                    className={"max-w-12 max-h-12	w-auto h-auto hover:drop-shadow-platformIcon"}
                    src={pfl.platform.icon}
                  />
                </a>
              );
            }
          })}
        </div>
      )}
      {isCreditsOpen && (
        <div
          className={"absolute inset-0 p-14 flex justify-around items-start"}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quod, quae quia cumque, quos, quas quidem sit voluptates quibusdam
          </p>
        </div>
      )}
    </div>
  );
}
