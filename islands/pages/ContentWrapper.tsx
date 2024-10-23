import { MCViewBox, useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import MNodeGen from "@islands/pages/MNodes/MNodeGen.tsx";
import { effect, signal } from "@preact/signals-core";
import { cn } from "@utils/cn.ts";
import { IconTrash } from "@utils/icons.ts";
import { createRef } from "preact";
import { Ref, useEffect, useRef, useCallback } from "preact/hooks";
import Button from "@islands/Button.tsx";
import _ from "lodash";

function MCFrameEvents(frame: SVGElement, initialViewBox: MCViewBox, setViewBox: (viewBox: MCViewBox) => void) {
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
    setViewBox(viewBox)
  }

  function onMouseWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault()
      viewBox = {
        ...viewBox,
        width: e.deltaY >= 0 ? viewBox.width * zoomFactor : viewBox.width / zoomFactor,
        height: e.deltaY >= 0 ? viewBox.height * zoomFactor : viewBox.height / zoomFactor,
      }
      frame.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`)
      setViewBox(viewBox)
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
  const {
    MCFrame,
    MCNodes,
    viewBox,
    setViewBox,
    isPreview,
    hasPendingChanges,
    writeNodes,
    autoSaved,
    setPreview
  } = useMNodeContext();
  
  const throttledSetViewBox = useCallback(
    // @ts-expect-error - lodash types are not correct
    _.throttle((viewBox: MCViewBox) => {
      setViewBox(viewBox);
    }, 500),
    []
  );

  /* All hotkeys and mouse logic are in native event listener to avoid useless re-renders of states */
  useEffect(() => {
    if (MCFrame.current && viewBox) {
      MCFrameEvents(MCFrame.current, viewBox, throttledSetViewBox)
    }
  }, [MCFrame.current])

  useEffect(() => {
    if (autoSaved) {
      toast({
        title: "Bricks have been successfully saved",
        description: `${MCNodes.length} bricks have been saved`,
      });
    }
  }, [autoSaved]);

  // On page quit, if hasPendingChanges, ask user if they want to save
  useEffect(() => {
    hasPendingChanges &&
      globalThis.addEventListener(
        "beforeunload",
        (e) => confirm("You have unsaved changes. Do you want to save them?"),
      );
  }, [hasPendingChanges]);

  return (
    <>
      <div className={"relative w-full grow flex flex-col gap-4"}>
        <div
          className={cn(
            "self-end flex justify-end items-center gap-3",
          )}
        >
          {!isPreview && hasPendingChanges && (
            <Button
              onClick={() => writeNodes()}
              variant={"secondary"}
            >Save bricks</Button>
          )}
          <button
            className={cn(
              "flex p-[2px] align-middle h-[30px] w-[60px] cursor-pointer rounded-full border-[1px] border-solid transition",
              isPreview
                ? "justify-end bg-text border-transparent"
                : "justify-start bg-black border-text",
            )}
            onClick={() => setPreview(!isPreview)}
          >
            <span
              className={cn(
                "h-[24px] w-[24px] rounded-full transition-all",
                isPreview ? "bg-black" : "bg-text",
              )}
            >
            </span>
          </button>
        </div>
        <svg
          ref={MCFrame}
          className={"relative w-full h-full grow rounded-3xl border border-text_grey"}
        >
          {MCNodes.length &&
            MCNodes.map((node) => <MNodeGen nodeProp={node} />)}
        </svg>
      </div>
    </>
  );
}
