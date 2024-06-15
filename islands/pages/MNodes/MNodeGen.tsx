import { MNode } from "@models/Canva.ts";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "preact/hooks";
import { computed, effect, signal } from "@preact/signals-core";
import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import useRenderCount from "@hooks/useRenderCount.ts";

type MNodeGenProps = {
  nodeProp: MNode;
};

const SNAP_POINTS = 20;

export default function MNodeGen({ nodeProp }: MNodeGenProps) {
  // debug
  const renderCount = useRenderCount();

  const MC = useMNodeContext();
  // const node = signal<MNode>(nodeProp);
  const [node, setNode] = useState<MNode>(nodeProp);

  const DraggableNode = signal<Draggable>(Draggable);

  const MCFrame = computed(() => MC.MCFrame.value).value.current;

  const isDragging = signal<boolean>(false);

  gsap.registerPlugin(useGSAP, Draggable);
  const MNodeRef = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   if (MNodeRef.current && MCFrame) {
  //     DraggableNode.value.create(MNodeRef.current, {
  //       type: "x,y",
  //       edgeResistance: 0.65,
  //       bounds: MCFrame,
  //       onDrag: function () {
  //         console.log(
  //           `dragging x: ${this.x} + ${MC.viewBox.value.x} = ${
  //             this.x + MC.viewBox.value.x
  //           }, y: ${this.y} + ${MC.viewBox.value.y} = ${
  //             this.y + MC.viewBox.value.y
  //           }`,
  //         );
  //         this.x = this.x + MC.viewBox.value.x;
  //         this.y = this.y + MC.viewBox.value.y;
  //         gsap.set(MNodeRef.current, {
  //           css: {
  //             x: this.x,
  //             y: this.y,
  //           },
  //         });
  //         setNode((prev) => ({ ...prev, x: this.x, y: this.y }));
  //         // console.log("dragging after: ", this.x, this.y);
  //       },
  //       // onDragEnd: function () {
  //       //   setNode((prev) => ({ ...prev, x: this.x, y: this.y }));
  //       // },
  //       liveSnap: {
  //         x: (x: number) => Math.round(x / SNAP_POINTS) * SNAP_POINTS,
  //         y: (y: number) => Math.round(y / SNAP_POINTS) * SNAP_POINTS,
  //       },
  //     });
  //   }
  // }, [MNodeRef]);

  useEffect(() => {
    if (MNodeRef.current) {
      MNodeRef.current.style.transform = `translate3d(${nodeProp.x + MC.viewBox.value.x}px, ${
        nodeProp.y + MC.viewBox.value.y
      }px, 0)`;
    }
  }, [MC.viewBox.value.x, MC.viewBox.value.y, MC.viewBox.value.scale]);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const onDrag = (e: MouseEvent) => {
    if (isDragging.value) {
      const { movementX, movementY } = e;
      setNode((prev) => ({
        ...prev,
        x: prev.x + movementX,
        y: prev.y + movementY,
      }));
    }
  };

  const onMouseDown = () => {
    isDragging.value = true;
    globalThis.addEventListener('mousemove', onDrag);
    globalThis.addEventListener('mouseup', onMouseUp);
  };
  
  const onMouseUp = () => {
    isDragging.value = false;
    globalThis.removeEventListener('mousemove', onDrag);
    globalThis.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <article
      className={"absolute"}
      ref={MNodeRef}
      style={{
        width: `${node.width}px`,
        height: `${node.height}px`,
        backgroundColor: generateRandomColor(),
        transform: `translate3d(${node.x + MC.viewBox.value.x}px, ${
          node.y + MC.viewBox.value.y
        }px, 0)`,
      }}
      onMouseDown={onMouseDown}
    >
      <p>{renderCount}</p>
      <p>x: {node.x}, y: {node.y}</p>
    </article>
  );
}
