import { Ref, useEffect, useRef, useState } from "preact/hooks";
import { MNode } from "@models/Canva.ts";
import MNodeGen from "@islands/pages/MNodes/MNodeGen.tsx";
import { useContext } from "preact/hooks";
import { MNodeProvider, useMNodeContext } from "@contexts/MNodeContext.tsx";
import { VNode, createRef } from "preact";
import { computed, effect, signal } from "@preact/signals-core";
import { cn } from "@utils/cn.ts";

function CWrapperContent() {
  const MC = useMNodeContext();
  // const MFrameRef = useRef<HTMLElement>(null);
  const isDragging = signal<boolean>(false);
  const [displayedNodes, setDisplayedNodes] = useState<MNode[]>([]);
  effect(() => setDisplayedNodes(MC.MCNodes.value));

  const MFrameRef = signal<Ref<HTMLDivElement>>(createRef());

  const [isPreview, setIsPreview] = useState<boolean>(MC.isPreview);

  // useEffect(() => {
  //   if (isPreview !== MC.isPreview) MC.setPreview(isPreview);
  // }, [isPreview]);

  const zoom = (direction: "in" | "out") => {
    const zoomFactor = 0.1;
    const zoomValue = direction === "in" ? zoomFactor : -zoomFactor;
    MC.setViewBox({
      x: MC.viewBox.value.x,
      y: MC.viewBox.value.y,
      scale: MC.viewBox.value.scale + zoomValue,
    });
  };

  useEffect(() => {
    console.log("Setting MC frame to ", MFrameRef.value.current);
    if (MFrameRef.value.current) {
      MC.setMCFrame(MFrameRef.value);
    }
  }, [MFrameRef.value]);

  // effect(() => MFrameRef.value.current && MC.setMCFrame(MFrameRef.value));

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

  return (
    <div className={"relative w-full grow"}>
      <button
        className={cn(
          "absolute flex p-[2px] align-middle top-[calc(-30px-10px)] right-0 h-[30px] w-[60px] cursor-pointer rounded-full border-[1px] border-solid transition",
          isPreview
            ? "justify-end bg-text border-transparent"
            : "justify-start bg-black border-text",
        )}
        onClick={() =>
          setIsPreview((prev) => {
            MC.setPreview(!prev);
            return !prev;
          })}
      >
        <span
          className={cn(
            "h-[24px] w-[24px] rounded-full transition-all",
            isPreview ? "bg-black" : "bg-text",
          )}
        >
        </span>
      </button>
      <section
        ref={MFrameRef.value}
        className={"relative w-full h-full grow rounded-3xl border border-text_grey overflow-hidden"}
        onMouseDown={() => isDragging.value = true}
        onMouseUp={() => isDragging.value = false}
        onMouseMove={handleMouseMovement}
      >
        {displayedNodes.length &&
          displayedNodes.map((node) => <MNodeGen nodeProp={node} />)}
        <div className={"absolute top-2 left-2 bg-text_grey flex flex-row p-2"}>
          <div className={"text-xl"} onClick={() => zoom("in")}>+</div>
          <div className={"text-xl"} onClick={() => zoom("out")}>-</div>
        </div>
      </section>
    </div>
  );
}

/**
 * Export the ContentWrapper component, containing the MNodeProvider and CWrapperContent components
 */
export default function CWrapper() {
  return (
    // <MNodeProvider>
      <CWrapperContent />
    // </MNodeProvider>
  );
}
