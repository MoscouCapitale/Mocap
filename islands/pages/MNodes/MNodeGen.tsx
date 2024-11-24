import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useGSAP } from "@gsap/react";
import { CANVA_GUTTER, MNode, getAvailableSizes } from "@models/Canva.ts";
import { signal } from "@preact/signals-core";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Ref, useCallback, useEffect, useMemo, useState } from "preact/hooks";

import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import { cn } from "@utils/cn.ts";
import { IconHandGrab, IconTrash } from "@utils/icons.ts";
import { createRef } from "https://esm.sh/v128/preact@10.19.6/src/index.js";
import SizeSelector from "@islands/pages/MNodes/SizeSelector.tsx";
import { useIsomorphicLayoutEffect } from "@hooks/useIsomorphicLayoutEffect.ts";

type MNodeGenProps = {
  nodeProp: MNode;
};

export default function MNodeGen({ nodeProp }: MNodeGenProps) {
  const { MCNodes, deleteNode, getFreeSpace, saveNode, MCFrame, isPreview } = useMNodeContext();

  useEffect(() => setNode({...nodeProp, sizes: getAvailableSizes(nodeProp)}), [nodeProp]);

  const [node, setNode] = useState<MNode>(nodeProp);

  gsap.registerPlugin(useGSAP, Draggable);

  const MNodeRef = signal<Ref<SVGForeignObjectElement>>(createRef());
  const GrabberRef = signal<Ref<HTMLDivElement>>(createRef());

  const canResizeNode = useMemo(() => node.sizes.length > 0, [node.sizes]);

  const onDragEnd = useCallback(function (this: Draggable) {
    const nodePos = {
      id: node.id,
      x1: this.x,
      y1: this.y,
      x2: this.x + node.width,
      y2: this.y + node.height,
    };
    const newPos = getFreeSpace(nodePos);
    if (newPos.x1 !== this.x || newPos.y1 !== this.y) {
      this.x = newPos.x1;
      this.y = newPos.y1;
    }
    updateNode({ x: this.x, y: this.y }, true);
  }, [MCNodes]);

  /** FIXME: This is a workaround to make the getFreeSpace work, but for now it the pos with one "frame" of
   * delay, so it checks the previopus pos of each node, instead of the current one */
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (node && MNodeRef.value.current && MCFrame.current && GrabberRef.value.current) {
        Draggable.create(MNodeRef.value.current, {
          type: "x,y",
          edgeResistance: 0.65,
          trigger: GrabberRef.value.current,
          onDragEnd,
          liveSnap: {
            x: (x: number) => Math.round(x / CANVA_GUTTER) * CANVA_GUTTER,
            y: (y: number) => Math.round(y / CANVA_GUTTER) * CANVA_GUTTER,
          },
        });
      }
    }, MNodeRef.value);
    return () => ctx.revert();
  }, [node]);

  /** This is here we set the gsap value, from the node value */
  useEffect(() => {
    gsap.set(MNodeRef.value.current, {
      css: {
        x: node.x,
        y: node.y,
      },
    });
  }, [node]);

  const updateNode = (newNodeDatas: Partial<MNode> = node, saveToContext = false, rerender = true) => {
    setNode((prev) => {
      const newNode = { ...prev, ...newNodeDatas };
      if (saveToContext) saveNode({ node: newNode, rerender });
      return newNode;
    });
  };

  return (
    <foreignObject data-nodeId={`canva_node_${node.id}`} className={"group select-none overflow-visible"} ref={MNodeRef.value} width={node.width} height={node.height}>
      {/* We need to display none the toolbar if we wanna hide it, because otherwise we cannot get the ref of the grabber */}
      <div
        className={cn(
          "p-3 flex-row justify-end items-center gap-3 bg-black bg-opacity-60 z-50 absolute top-px right-px rounded-bl-[20px] rounded-tr-[20px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
          isPreview ? "hidden" : "flex"
        )}
      >
        {/* Size selector & setter */}
        {canResizeNode && <SizeSelector node={node} setSize={updateNode} />}

        {/* Grabber to move the node */}
        <div ref={GrabberRef.value} className={"text-text flex items-center justify-center"}>
          <IconHandGrab />
        </div>

        {/* Delete node */}
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-text outline-none"
          aria-label="Delete node"
          onClick={() => {
            if (!isPreview && globalThis.confirm("Are you sure you want to delete this node?")) {
              deleteNode(node.id);
            }
          }}
        >
          <IconTrash />
        </button>
      </div>

      {/* Actual node content */}
      {getBrickFromCanvaNode(node, { isMovable: !isPreview, disableAnimations: true, brickSize: { width: node.width, height: node.height } })}
    </foreignObject>
  );
}
