import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import MNodeGen from "@islands/pages/MNodes/MNodeGen.tsx";
import { effect, signal } from "@preact/signals-core";
import { cn } from "@utils/cn.ts";
import { IconTrash } from "@utils/icons.ts";
import { createRef } from "preact";
import { Ref, useEffect } from "preact/hooks";
import Button from "@islands/Button.tsx";

export default function MCanva() {
  const { toast } = useToast()
  const MC = useMNodeContext();
  // const MFrameRef = useRef<HTMLElement>(null);
  const isDragging = signal<boolean>(false);

  const MFrameRef = signal<Ref<HTMLDivElement>>(createRef());

  // useEffect(() => {
  //   if (isPreview !== MC.isPreview) MC.setPreview(isPreview);
  // }, [isPreview]);

  const zoom = (direction: "in" | "out") => {
    const zoomFactor = 0.1;
    const zoomValue = direction === "in" ? zoomFactor : -zoomFactor;
    MC.setViewBox({
      x: MC.viewBox.x,
      y: MC.viewBox.y,
      scale: MC.viewBox.scale + zoomValue,
    });
  };

  effect(() => {
    if (MC.autoSaveMessage?.value) {
      toast({
        title: "Bricks have been successfully saved",
        description: MC.autoSaveMessage.value,
      });
      MC.autoSaveMessage.value = undefined;
    }
  });

  const handleMouseMovement = (e: MouseEvent) => {
    // if (isDragging.value && e.ctrlKey) {
    //   const { movementX, movementY } = e;
    //   MC.setViewBox({
    //     ...MC.viewBox.value,
    //     x: MC.viewBox.value.x + movementX,
    //     y: MC.viewBox.value.y + movementY,
    //   });
    // }
  };

  // On page quit, if hasPendingChanges, ask user if they want to save
  useEffect(() => {
    MC.hasPendingChanges && globalThis.addEventListener("beforeunload", (e) => confirm("You have unsaved changes. Do you want to save them?"));
  }, [MC.hasPendingChanges]);

  return (
    <>
    <div className={"relative w-full grow"}>
      <div className={cn("absolute top-[-4%] right-0 flex justify-end items-center gap-3")}>
        {!MC.isPreview && MC.hasPendingChanges && <Button onClick={() => MC.writeNodes()} text={"Save bricks"} variant={"secondary"} />}
        <button
          className={cn(
            "flex p-[2px] align-middle h-[30px] w-[60px] cursor-pointer rounded-full border-[1px] border-solid transition",
            MC.isPreview
              ? "justify-end bg-text border-transparent"
              : "justify-start bg-black border-text",
          )}
          onClick={() => MC.setPreview(!MC.isPreview)}
        >
          <span
            className={cn(
              "h-[24px] w-[24px] rounded-full transition-all",
              MC.isPreview ? "bg-black" : "bg-text",
            )}
          >
          </span>
        </button>
      </div>
      <section
        ref={MC.MCFrame}
        className={"relative w-full h-full grow rounded-3xl border border-text_grey overflow-hidden"}
        onMouseDown={() => isDragging.value = true}
        onMouseUp={() => isDragging.value = false}
        onMouseMove={handleMouseMovement}
      >
        {MC.MCNodes.length &&
          MC.MCNodes.map((node) => <MNodeGen nodeProp={node} />)}

        {!MC.isPreview && (
          <>
            <div className={"absolute top-2 left-2 bg-text_grey flex flex-row p-2"}>
              <div className={"text-xl"} onClick={() => zoom("in")}>+</div>
              <div className={"text-xl"} onClick={() => zoom("out")}>-</div>
            </div>
            <div className={"absolute bottom-0 right-0 p-[2%] w-[10vw] h-[10vw] max-h-[80px] max-w-[80px] cursor-pointer"}>
              <IconTrash className={"w-full h-full"} color={"#FFF"} />
            </div>
          </>
        )}
      </section>
    </div>
    </>
  );
}
