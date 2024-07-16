import { CANVA_GUTTER, MNode } from "@models/Canva.ts";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { Ref, useCallback, useEffect, useRef, useState } from "preact/hooks";
import { computed, effect, signal } from "@preact/signals-core";
import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import useRenderCount from "@hooks/useRenderCount.ts";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";

import {
  IconChartDonut,
  IconHandGrab,
  IconResize,
  IconSettings2,
} from "@utils/icons.ts";
import Dropdown from "@islands/Dropdown.tsx";
import { getBrickFromBrickType } from "@utils/bricks.tsx";
import { RefObject, createRef } from "https://esm.sh/v128/preact@10.19.6/src/index.js";

type MNodeGenProps = {
  nodeProp: MNode;
};

export default function MNodeGen({ nodeProp }: MNodeGenProps) {
  // debug
  const renderCount = useRenderCount();

  const MC = useMNodeContext();
  // const node = signal<MNode>(nodeProp);
  const [node, setNode] = useState<MNode>(nodeProp);

  const DraggableNode = signal<typeof Draggable>(Draggable);

  
  gsap.registerPlugin(useGSAP, Draggable);
  const MNodeRef = useRef<HTMLElement>(null);
  // const GrabberRef = useRef<HTMLDivElement>(null);
  // const [GrabberRef, setGrabberRef] = useState<HTMLDivElement | null>(null);
  const GrabberRef = signal<Ref<HTMLDivElement>>(createRef());
  const [isToolbarOpened, setIsToolbarOpened] = useState<boolean>(false);
  
  const MCFrame = computed(() => MC.MCFrame.value).value.current;
  // const isPreview = computed(() => MC.isPreview).value

  effect(() => console.log("MC preview updated to: ", MC.isPreview))
  // effect(() => console.log("isPreview updated to: ", isPreview))

  useEffect(() => {
    if (MNodeRef.current && MCFrame && GrabberRef.value.current) {
      console.log("Creating draggable node");
      DraggableNode.value.create(MNodeRef.current, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: MCFrame,
        trigger: GrabberRef.value.current,
        onDragEnd: function () {
          const nodePos = {
            id: node.id,
            x1: this.x,
            y1: this.y,
            x2: this.x + node.width,
            y2: this.y + node.height,
          };
          const newPos = MC.getFreeSpace(nodePos);
          if (newPos.x1 !== this.x || newPos.y1 !== this.y) {
            this.x = newPos.x1;
            this.y = newPos.y1;
            gsap.set(MNodeRef.current, {
              css: {
                x: this.x,
                y: this.y,
              },
            });
          }
          setNode((prev) => ({ ...prev, x: this.x, y: this.y }));
        },
        liveSnap: {
          x: (x: number) => Math.round(x / CANVA_GUTTER) * CANVA_GUTTER,
          y: (y: number) => Math.round(y / CANVA_GUTTER) * CANVA_GUTTER,
        },
      });
    }
  }, [MNodeRef.current, MCFrame, GrabberRef.value]);

  useEffect(() => {
    MC.saveNode(node);
  }, [node]);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}4f`;
  };

  return (
    <article
      className={"absolute z-30 group rounded-[20px]"}
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
      {!MC.isPreview && (
        <>
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
                        onSelect={() => {
                          setNode((prev) => ({
                            ...prev,
                            width: size.width,
                            height: size.height,
                          }));
                        }}
                      >
                        {size.width}x{size.height}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
          <div ref={GrabberRef.value}
          className={"text-text absolute top-0 right-0"}>
            <IconHandGrab />
          </div>
        </>
      )}
      {getBrickFromBrickType(node)}
      {/* debug */}
      <p>{renderCount}</p>
      <p>id: {node.id.slice(0, 5)}</p>
      <p>x: {node.x}, y: {node.y}</p>
    </article>
  );
}
