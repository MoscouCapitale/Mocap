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

  const DraggableNode = signal<typeof Draggable>(Draggable);

  const MCFrame = computed(() => MC.MCFrame.value).value.current;

  gsap.registerPlugin(useGSAP, Draggable);
  const MNodeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (MNodeRef.current && MCFrame) {
      DraggableNode.value.create(MNodeRef.current, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: MCFrame,
        onDragEnd: function () {
          const overlap = MC.isOverlapping({
            id: node.id,
            x1: this.x,
            y1: this.y,
            x2: this.x + node.width,
            y2: this.y + node.height,
          });
          if (overlap.isOverlapping) {
            // If overlapping, move the node 100px up
            this.y -= 100;
            gsap.set(MNodeRef.current, {
              css: {
                x: this.x,
                y: this.y,
              },
            });
          } else setNode((prev) => ({ ...prev, x: this.x, y: this.y }));
        },
        liveSnap: {
          x: (x: number) => Math.round(x / SNAP_POINTS) * SNAP_POINTS,
          y: (y: number) => Math.round(y / SNAP_POINTS) * SNAP_POINTS,
        },
      });
    }
  }, [MNodeRef]);

  useEffect(() => {
    MC.saveNode(node);
  }, [node]);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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
    >
      <p>{renderCount}</p>
      <p>id: {node.id.slice(0, 5)}</p>
      <p>x: {node.x}, y: {node.y}</p>
    </article>
  );
}
