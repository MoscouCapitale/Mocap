import { Ref, useEffect, useRef, useState } from "preact/hooks";
import { MNode } from "@models/Canva.ts";
import MNodeGen from "@islands/pages/MNodes/MNodeGen.tsx";
import { useContext } from "preact/hooks";
import { MNodeProvider, useMNodeContext } from "@contexts/MNodeContext.tsx";
import { VNode } from "preact";
import { computed, effect, signal } from "@preact/signals-core";

function CWrapperContent() {
  const MC = useMNodeContext();
  const MFrameRef = useRef<HTMLElement>(null);
  const isDragging = signal<boolean>(false);
  const [displayedNodes, setDisplayedNodes] = useState<MNode[]>([]);
  effect(() => setDisplayedNodes(MC.MCNodes.value));

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
    if (MFrameRef) MC.setMCFrame(MFrameRef);
  }, [MFrameRef]);

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
    <section
      ref={MFrameRef}
      className={"relative w-full grow rounded-3xl border border-text_grey overflow-hidden"}
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
  );
}

/**
 * Export the ContentWrapper component, containing the MNodeProvider and CWrapperContent components
 */
export default function CWrapper() {
  return (
    <MNodeProvider>
      <CWrapperContent />
    </MNodeProvider>
  );
}
