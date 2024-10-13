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
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import { IconHandGrab, IconResize, IconTrash } from "@utils/icons.ts";
import { createRef } from "https://esm.sh/v128/preact@10.19.6/src/index.js";
import { cn } from "@utils/cn.ts";

type MNodeGenProps = {
  nodeProp: MNode;
};

export default function MNodeGen({ nodeProp }: MNodeGenProps) {
  const renderCount = useRenderCount();
  const {
    MCNodes,
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
  const useIsomorphicLayoutEffect = (typeof window !== "undefined")
    ? useLayoutEffect
    : useEffect;
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (
        node &&
        MNodeRef.value.current && MCFrame.current &&
        GrabberRef.value.current
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
    rerender = true,
  ) => {
    setNode((prev) => {
      const newNode = { ...prev, ...newNodeDatas };
      if (saveToContext) saveNode(newNode, rerender);
      return newNode;
    });
  };

  return (
    <foreignObject
      className={"group select-none overflow-visible"}
      ref={MNodeRef.value}
      width={node.width}
      height={node.height}
    >
      {/* We need to display none the toolbar if we wanna hide it, because otherwise we cannot get the ref of the grabber */}
      <div
        className={cn(
          "p-3 flex-row justify-end items-center gap-3 bg-black bg-opacity-60 z-50 absolute top-px right-px rounded-bl-[20px] rounded-tr-[20px] opacity-0 invisible group-hover:opacity-100 group-hover:visible",
          isPreview ? "hidden" : "flex",
        )}
      >
        {/* Sizes selector */}
        {node.sizes.length > 1 && (
          <NavigationMenu.Root className="relative z-[1] flex justify-center">
            <NavigationMenu.List className="center m-0 flex list-none rounded-[6px] p-1">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="text-text flex select-none items-center leading-none outline-none">
                  <IconResize />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full right-0">
                  <ul className="flex flex-col justify-start list-none m-0 rounded-md bg-black overflow-hidden border border-text_grey w-28">
                    {node.sizes.map((size) => {
                      const isSelected = size.width === node.width &&
                        size.height === node.height;
                      return (
                        <li
                          key={`${size.width}x${size.height}`}
                          className={cn(
                            "text-text py-1 px-1 bg-text bg-opacity-0 hover:bg-opacity-10 w-full cursor-pointer text-left",
                            isSelected
                              ? "underline font-semibold"
                              : "font-normal",
                          )}
                          onClick={() => {
                            if (!isSelected) {
                              updateNode(
                                {
                                  width: size.width,
                                  height: size.height,
                                },
                                true,
                              );
                            }
                          }}
                        >
                          {size.width}x{size.height}
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        )}

        {/* Grabber to move the node */}
        <div
          ref={GrabberRef.value}
          className={"text-text flex items-center justify-center"}
        >
          <IconHandGrab />
        </div>

        {/* Delete node */}
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-text outline-none"
          aria-label="Delete node"
          onClick={() => {
            if (
              !isPreview &&
              globalThis.confirm("Are you sure you want to delete this node?")
            ) {
              deleteNode(node.id);
            }
          }}
        >
          <IconTrash />
        </button>
      </div>

      {/* Actual node content */}
      {getBrickFromCanvaNode(node, { isMovable: !isPreview, disableAnimations: true })}

      {/* debug */}
      {!isPreview && (
        <div className={"absolute bottom-0 left-0 bg-black text-white"}>
          <p>{renderCount}</p>
          <p>id: {node.id.slice(0, 5)}</p>
          <p>x: {node.x}, y: {node.y}</p>
        </div>
      )}
    </foreignObject>
  );
}
