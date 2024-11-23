import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useIsomorphicLayoutEffect } from "@hooks/useIsomorphicLayoutEffect.ts";
import Button from "@islands/Button.tsx";
import { CANVA_GUTTER, MNode, NODE_MIN_SIZE } from "@models/Canva.ts";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Portal } from "@radix-ui/react-portal";
import { cn } from "@utils/cn.ts";
import { IconGripHorizontal, IconGripVertical, IconResize } from "@utils/icons.ts";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";

type SizeSelectorProps = {
  node: MNode;
  setSize: (s: MNode["sizes"][0], isFinale?: boolean) => void;
};

export default function SizeSelector({ node, setSize }: SizeSelectorProps) {
  const { lockViewBox, setLockViewBox } = useMNodeContext();

  const isCurrentSizeFreeSized = useMemo(
    () => !node.sizes.some((s) => s.width === node.width && s.height === node.height),
    [node.sizes, node.width, node.height]
  );

  const [isFreeSizing, setIsFreeSizing] = useState(false);
  /** Node default size, use to reset the current width/height changes */
  const nodeDefaultSize = useMemo(() => ({ width: node.width, height: node.height }), [node.id]);

  const horizontalGrabRef = useRef<HTMLDivElement>(null);
  const verticalGrabRef = useRef<HTMLDivElement>(null);

  const updateNodeSize = useCallback(
    (direction: "x" | "y", val: number) => {
      const alertAndReset = () => {
        alert("La taille minimale est de 100px");
        // set the size, to reset the grabber position
        setSize({ width: node.width, height: node.height });
      };

      if (direction === "x") {
        if (Math.abs(node.width + val) < NODE_MIN_SIZE) return alertAndReset();
        setSize({ width: node.width + val, height: node.height });
      }
      if (direction === "y") {
        if (Math.abs(node.height + val) < NODE_MIN_SIZE) return alertAndReset();
        setSize({ width: node.width, height: node.height + val });
      }
    },
    [node.width, node.height]
  );

  useIsomorphicLayoutEffect(() => {
    if (isFreeSizing && lockViewBox && horizontalGrabRef.current && verticalGrabRef.current) {
      const hdrag = Draggable.create(horizontalGrabRef.current, {
        type: "x",
        edgeResistance: 0.65,
        onDragEnd: function () {
          updateNodeSize("x", this.x);
        },
        liveSnap: { x: (x: number) => Math.round(x / CANVA_GUTTER) * CANVA_GUTTER },
      });

      const vdrag = Draggable.create(verticalGrabRef.current, {
        type: "y",
        edgeResistance: 0.65,
        onDragEnd: function () {
          updateNodeSize("y", this.y);
        },
        liveSnap: { y: (y: number) => Math.round(y / CANVA_GUTTER) * CANVA_GUTTER },
      });

      return () => {
        hdrag[0].kill();
        vdrag[0].kill();
      };
    }
  }, [isFreeSizing, lockViewBox, node.width, node.height]);

  // When the node width/height changes, reset the grabber position, to have the correct starting position
  useEffect(() => gsap.set(horizontalGrabRef.current, { css: { x: 0 } }), [node.width]);
  useEffect(() => gsap.set(verticalGrabRef.current, { css: { y: 0 } }), [node.height]);

  return (
    <>
      <NavigationMenu.Root className="relative z-[1] flex justify-center">
        <NavigationMenu.List className="center m-0 flex list-none rounded-[6px] p-1">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="text-text flex select-none items-center leading-none outline-none">
              <IconResize />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="absolute top-full right-0">
              <ul
                className={cn("flex justify-start list-none m-0 rounded-md bg-black border border-text_grey", node.height < 200 ? "flex-row" : "flex-col w-28")}
              >
                {node.sizes.map((size) => {
                  const isSelected = size.width === node.width && size.height === node.height;
                  return (
                    <SizeChoiceItem
                      key={`${size.width}x${size.height}`}
                      size={size}
                      onClick={() => {
                        if (!isSelected) {
                          if (isCurrentSizeFreeSized) {
                            if (confirm("Voulez-vous vraiment changer la taille de ce bloc ? La taille actuelle sera perdue.")) setSize(size);
                          } else setSize(size);
                        }
                      }}
                      isSelected={!isFreeSizing && isSelected}
                    />
                  );
                })}
                <SizeChoiceItem
                  size={null}
                  onClick={() => {
                    setIsFreeSizing((p) => {
                      if (!p) {
                        setLockViewBox(true);
                        return true;
                      }
                      return p;
                    });
                  }}
                  isSelected={isCurrentSizeFreeSized}
                />
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* FIXME: using a ref should be better, but for now it is not reliable. A queryselect works fine each time, but is not the best practice. */}
      <Portal container={globalThis.document.querySelector(`[data-nodeId=canva_node_${node.id}]`)}>
        <div className={cn("absolute inset-0 overflow-visible backdrop-brightness-[0.3]", isFreeSizing ? "block" : "hidden")}>
          {/* Right arrow resize */}
          <div className={cn("absolute top-1/2 -translate-y-1/2 right-[-16px] flex items-center text-text grabberStyle horizontal")} ref={horizontalGrabRef}>
            <IconGripVertical />
          </div>
          {/* Bottom arrow resize */}
          <div className={cn("absolute bottom-[-16px] left-1/2 -translate-x-1/2 flex flex-col items-center text-text grabberStyle")} ref={verticalGrabRef}>
            <IconGripHorizontal />
          </div>
          {/* Middle validation/cancel button */}
          <div className={cn("absolute pos-center flex items-center gap-2")}>
            <Button
              onClick={() => {
                setSize({ width: node.width, height: node.height }, true);
                setIsFreeSizing(false);
                setLockViewBox(false);
              }}
            >
              Confirmer
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setSize(nodeDefaultSize, true);
                setIsFreeSizing(false);
                setLockViewBox(false);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Portal>
    </>
  );
}

type SizeChoiceItemProps = {
  size: MNode["sizes"][0] | null;
  onClick: () => void;
  isSelected: boolean;
};

const SizeChoiceItem = ({ size, onClick, isSelected }: SizeChoiceItemProps) => {
  return (
    <li
      className={cn(
        "text-text py-2 px-3 bg-text bg-opacity-0 hover:bg-opacity-10 w-full cursor-pointer text-left",
        isSelected ? "underline font-semibold" : "font-normal"
      )}
      onClick={onClick}
    >
      {size ? `${size.width}x${size.height}` : "Libre"}
    </li>
  );
};
