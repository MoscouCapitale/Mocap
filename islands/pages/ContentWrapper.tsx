import { MCViewBox, useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import MNodeGen from "@islands/pages/MNodes/MNodeGen.tsx";
import { effect, signal } from "@preact/signals-core";
import { cn } from "@utils/cn.ts";
import { IconTrash } from "@utils/icons.ts";
import { createRef } from "preact";
import { Ref, useEffect, useRef } from "preact/hooks";
import Button from "@islands/Button.tsx";

function MCFrameEvents(frame: SVGElement, initialViewBox: MCViewBox) {
  if (!frame) return

  let viewBox = initialViewBox
  frame.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`)
  let isDragging = false;
  const zoomFactor = 1.1

  function onMouseDown(e: MouseEvent) {
    if (!isDragging) isDragging = true
  }

  function onMouseUp(e: MouseEvent) {
    if (isDragging) isDragging = false
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return
    viewBox = {
      ...viewBox,
      x: viewBox.x - e.movementX,
      y: viewBox.y - e.movementY,
    }
    frame.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`)
  }

  function onMouseWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault()
      const oldvb = viewBox
      viewBox = {
        ...viewBox,
        width: e.deltaY >= 0 ? viewBox.width * zoomFactor : viewBox.width / zoomFactor,
        height: e.deltaY >= 0 ? viewBox.height * zoomFactor : viewBox.height / zoomFactor,
      }
      frame.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`)
    }
  }

  frame.addEventListener('mousedown', onMouseDown)
  frame.addEventListener('mouseup', onMouseUp)
  frame.addEventListener('mousemove', onMouseMove)
  frame.addEventListener('wheel', onMouseWheel)

  return () => {
    frame.removeEventListener('mousedown', onMouseDown)
    frame.removeEventListener('mouseup', onMouseUp)
    frame.removeEventListener('mousemove', onMouseMove)
    frame.removeEventListener('wheel', onMouseWheel)
  }
}

export default function MCanva() {
  const { toast } = useToast();
  const MC = useMNodeContext();
  const isDragging = signal<boolean>(false);

  /* All hotkeys and mouse logic are in native event listener to avoid useless re-renders of states */
  useEffect(() => {
    if (MC.MCFrame.current && MC.viewBox) {
      console.log("running svg frame events fun")
      MCFrameEvents(MC.MCFrame.current, MC.viewBox)
    }
  }, [MC.MCFrame.current, MC.viewBox])

  // const zoom = (direction: "in" | "out") => {
  //   const zoomFactor = 0.1;
  //   const zoomValue = direction === "out" ? zoomFactor : -zoomFactor;
  //   console.log(`Zooming ${direction} by ${zoomValue} on ${MC.viewBox.width}`);
  //   MC.setViewBox({
  //     ...MC.viewBox,
  //     width: MC.viewBox.width * (1 + zoomValue),
  //     height: MC.viewBox.height * (1 + zoomValue),
  //   });
  // };

  effect(() => {
    if (MC.autoSaveMessage?.value) {
      toast({
        title: "Bricks have been successfully saved",
        description: MC.autoSaveMessage.value,
      });
      MC.autoSaveMessage.value = undefined;
    }
  });

  // On page quit, if hasPendingChanges, ask user if they want to save
  useEffect(() => {
    MC.hasPendingChanges &&
      globalThis.addEventListener(
        "beforeunload",
        (e) => confirm("You have unsaved changes. Do you want to save them?"),
      );
  }, [MC.hasPendingChanges]);

  return (
    <>
      <div className={"relative w-full grow"}>
        <div
          className={cn(
            "absolute top-[-4%] right-0 flex justify-end items-center gap-3",
          )}
        >
          {!MC.isPreview && MC.hasPendingChanges && (
            <Button
              onClick={() => MC.writeNodes()}
              text={"Save bricks"}
              variant={"secondary"}
            />
          )}
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
        <svg
          ref={MC.MCFrame}
          className={"relative w-full h-full grow rounded-3xl border border-text_grey overflow-hidden"}
        >
          {MC.MCNodes.length &&
            MC.MCNodes.map((node) => <MNodeGen nodeProp={node} />)}
        </svg>
        {!MC.isPreview && (
          <>
            {/* <div
              className={"absolute top-2 left-2 bg-text_grey flex flex-row p-2"}
            >
              <div className={"text-xl"} onClick={() => zoom("in")}>+</div>
              <div className={"text-xl"} onClick={() => zoom("out")}>-</div>
            </div> */}
            <div
              className={"absolute bottom-0 right-0 p-[2%] w-[8vw] h-[8vw] max-h-[80px] max-w-[80px] cursor-pointer"}
            >
              <IconTrash className={"w-full h-full"} color={"#FFF"} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
