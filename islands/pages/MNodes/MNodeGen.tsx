import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useGSAP } from "@gsap/react";
import useRenderCount from "@hooks/useRenderCount.ts";
import {
  CANVA_GUTTER,
  MNode,
  TRASH_DEADZONE_MULTIPLIER,
} from "@models/Canva.ts";
import { computed, effect, signal } from "@preact/signals-core";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { getBrickFromBrickType } from "@utils/bricks.tsx";
import { IconHandGrab, IconResize } from "@utils/icons.ts";
import { createRef } from "https://esm.sh/v128/preact@10.19.6/src/index.js";
import { cn } from "@utils/cn.ts";
import { BricksType } from "@models/Bricks.ts";

type MNodeGenProps = {
  nodeProp: MNode;
};

export default function MNodeGen({ nodeProp }: MNodeGenProps) {
  const renderCount = useRenderCount();
  const {
    MCNodes,
    trashPos,
    deleteNode,
    getFreeSpace,
    saveNode,
    MCFrame,
    isPreview,
  } = useMNodeContext();

  useEffect(() => setNode(node), [nodeProp]);

  const [node, setNode] = useState<MNode>(nodeProp);

  gsap.registerPlugin(useGSAP, Draggable);

  const MNodeRef = signal<Ref<SVGForeignObjectElement>>(createRef());
  const GrabberRef = signal<Ref<HTMLDivElement>>(createRef());

  // FIXME: this is triggered when you change the viewbox (should be triggered only when you change the node position)
  /** Here we manage if you set the node on top of the trashcan */
  // effect(() => {
  //   if (
  //     !isPreview &&
  //     (node.x + node.width >= trashPos.x &&
  //       node.y + node.height >= trashPos.y) &&
  //     globalThis.confirm("Are you sure you want to delete this node?")
  //   ) {
  //     deleteNode(node.id);
  //   }
  // });

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
    updateNode({ x: this.x, y: this.y }, true, true);
    if (
      !isPreview &&
      (this.x + node.width >= trashPos.x &&
        this.y + node.height >= trashPos.y) &&
      globalThis.confirm("Are you sure you want to delete this node?")
    ) {
      deleteNode(node.id);
    }
  }, [MCNodes]);

  /** FIXME: This is a workaround to make the getFreeSpace work, but for now it the pos with one "frame" of
   * delay, so it checks the previopus pos of each node, instead of the current one */
  const useIsomorphicLayoutEffect = (typeof window !== "undefined")
    ? useLayoutEffect
    : useEffect;
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (
        node &&
        MNodeRef.value.current && MCFrame.current &&
        GrabberRef.value.current && trashPos.isReady
      ) {
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

  const updateNode = (
    newNodeDatas: Partial<MNode> = node,
    saveToContext = false,
    rerender = false,
  ) => {
    setNode((prev) => {
      const newNode = { ...prev, ...newNodeDatas };
      if (saveToContext) saveNode(newNode, rerender);
      return newNode;
    });
  };

  return (
    <foreignObject
      className={"group overflow-visible"}
      ref={MNodeRef.value}
      width={node.width}
      height={node.height}
    >
      <div className={cn("", isPreview ? "hidden" : "block")}>
        <div
          className={"w-full inline-flex justify-end bg-black z-10 nodeToolbar absolute top-0 left-0 transition-all duration-300 transform translate-y-0 opacity-0 group-hover:-translate-y-full group-hover:opacity-100"}
        >
          {node.sizes.length > 1 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-text outline-none"
                  aria-label="Customise options"
                >
                  <IconResize />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-black rounded-md p-[5px]"
                  side="top"
                >
                  {node.sizes.map((size) => (
                    <DropdownMenu.Item
                      className="group text-[13px] leading-none text-text rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:pointer-events-none"
                      onSelect={() =>
                        updateNode(
                          { ...node, width: size.width, height: size.height },
                          true,
                        )}
                    >
                      {size.width}x{size.height}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
        <div
          ref={GrabberRef.value}
          className={"text-text z-40 absolute top-0 right-0"}
        >
          <IconHandGrab />
        </div>
      </div>
      {getBrickFromBrickType(node, { isMovable: !isPreview })}
      {/* debug */}
      {!isPreview && (
        <div className={"absolute bottom-0 right-0 bg-black text-white"}>
          <p>{renderCount}</p>
          <p>id: {node.id.slice(0, 5)}</p>
          <p>x: {node.x}, y: {node.y}</p>
        </div>
      )}
    </foreignObject>
  );
}
