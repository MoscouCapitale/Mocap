import { BricksType } from "@models/Bricks.ts";
import { MNode } from "@models/Canva.ts";
import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import { throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useIsMobile } from "@hooks/useIsMobile.ts";
import { cn } from "@utils/cn.ts";
import { IconX } from "@utils/icons.ts";

type BrickLayoutProps = {
  nodes: MNode[];
};

type LayoutCanvaSize = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const followPointer = (e: PointerEvent) => {
  // Because the bricks are layed (on the x axis) from the 0, the x mouse pos is correct
  const x = e.x.toFixed(3);
  // But the y axis is not, so we have to add the current scroll position to the y mouse pos minus the height of the bricks from the height (100vh) of the window
  const y = (e.y + (globalThis.window.scrollY - (globalThis.window.innerHeight + 80))).toFixed(3);
  globalThis.document.documentElement.style.setProperty("--mouse-x", x);
  globalThis.document.documentElement.style.setProperty("--mouse-y", y);
};

export default function BrickLayout({ nodes }: BrickLayoutProps) {
  const isMobile = useIsMobile();

  const CONTENT_MARGIN = useMemo(() => (isMobile ? 20 : 80), [isMobile]);

  const mobileOverlayRef = useRef<HTMLDivElement>(null);

  const [renderedNodes, setRenderedNodes] = useState<MNode[] | null>(null);
  const [heroSectionPos, setHeroSectionPos] = useState<{ x: number; y: number } | null>();
  const [cachedWidth, setCachedWidth] = useState(0);

  const [focusedBrick, setFocusedBrick] = useState<MNode>();

  /** Calculate the size of the canva
   *
   * It takes all the nodes, and calculate the size of the "rectangle" that contains all the nodes,
   *  using the x and y coordinates of the nodes (excluding the hero section(s))
   *
   * @returns {LayoutCanvaSize} The size of the canva
   */
  const canvaSize: LayoutCanvaSize = useMemo(() => {
    const nodesCanvaSize = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity,
    };
    nodes.forEach((node) => {
      if (node.type === BricksType.HeroSection && !isMobile) return;
      if (node.x <= nodesCanvaSize.x1) nodesCanvaSize.x1 = node.x;
      if (node.x + node.width >= nodesCanvaSize.x2) {
        nodesCanvaSize.x2 = node.x + node.width;
      }
      if (node.y <= nodesCanvaSize.y1) nodesCanvaSize.y1 = node.y;
      if (node.y + node.height >= nodesCanvaSize.y2) {
        nodesCanvaSize.y2 = node.y + node.height;
      }
    });
    return nodesCanvaSize;
  }, []);

  /** Calculate the scale of the content. On mobile, we want to "dezoom" the content to fit the screen width */
  const contentScale = useMemo(
    () => (isMobile ? globalThis.innerWidth / (canvaSize.x2 - canvaSize.x1 + CONTENT_MARGIN * 2) : 1),
    [globalThis.innerWidth, canvaSize]
  );

  /** Calculate the full width and height of the content, to center it on the screen. The width is the screen width, and the height is the height of the canva */
  const fullWidth = useMemo(() => globalThis.innerWidth, [globalThis.innerWidth]);
  const fullHeight = useMemo(() => Math.max(Math.abs(canvaSize.y1 + canvaSize.y2 + CONTENT_MARGIN * 2) * contentScale, globalThis.innerHeight), [contentScale]);

  /** Get the hero section node
   *
   * Get the hero section node from the nodes, and create the brick from it.
   * It calculate the position of the hero section to display it at the top of the canva (
   *  when animated on scroll).
   */
  const HeroSection = useMemo(() => {
    const heroNode = nodes.find((n) => n.type === BricksType.HeroSection);
    if (!heroNode) return null;

    /** Configuration for the gsap animation, that tells where is the end position of the hero section */
    const animateConfig = {
      x: heroNode.x + (heroSectionPos?.x ?? 0),
      y: heroNode.y + (heroSectionPos?.y ?? 0),
      width: heroNode.width,
      height: heroNode.height,
    };

    return getBrickFromCanvaNode(heroNode, {
      asMainHeroSection: true,
      animateConfig,
      disableAnimations: isMobile,
    });
  }, [heroSectionPos]);

  /** Calculate the coordinates the nodes
   *
   * Using the canva size (rectangle containing all the nodes), it calculate the position of the nodes
   *  depending on the screen size. We do that to make the canva centered on the screen.
   */
  const calculateRenderedNodes = useCallback(() => {
    if (!globalThis?.innerHeight || !globalThis?.innerWidth) return;

    const vw = Math.max(document.documentElement.clientWidth || 0, globalThis.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, globalThis.innerHeight || 0);
    setCachedWidth(vw);

    const leftOffset = isMobile ? -1 * (canvaSize.x1 - CONTENT_MARGIN) : (vw - (canvaSize.x1 + canvaSize.x2)) / 2;
    const topOffset = -canvaSize.y1;

    setHeroSectionPos({ x: leftOffset, y: vh + CONTENT_MARGIN + topOffset });

    if (!vw || !vh || !canvaSize) return;

    setRenderedNodes(
      nodes
        .map((node) => {
          if (node.type === BricksType.HeroSection && !isMobile) return null;
          return {
            ...node,
            x: node.x + leftOffset,
            y: node.y + topOffset,
          };
        })
        .filter(Boolean) as MNode[]
    );
  }, [globalThis?.innerHeight, globalThis?.innerWidth, isMobile]);

  // TODO: this can be optimized
  const handleResize = throttle(() => {
    if (globalThis.innerWidth !== cachedWidth) {
      calculateRenderedNodes();
    }
  }, 500);

  useEffect(() => {
    calculateRenderedNodes();

    if (globalThis) {
      globalThis.addEventListener("resize", handleResize);
    }

    return () => {
      if (globalThis) {
        globalThis.removeEventListener("resize", handleResize);
      }
    };
  }, [calculateRenderedNodes]);

  /** Get the brick at a specific position on the screen */
  const getBrickAtPosition = useCallback(
    (x: number, y: number) => {
      // Get the scaled pos, because of the transform3d scaling
      x = x / contentScale;
      y = y / contentScale;
      return renderedNodes?.find((node) => {
        const rect = {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        };
        return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
      });
    },
    [renderedNodes]
  );

  /** Hover card effect on desktop */
  useEffect(() => {
    if (globalThis && !isMobile) globalThis.addEventListener("pointermove", throttle(followPointer, 80));

    return () => {
      if (globalThis) globalThis.removeEventListener("pointermove", followPointer);
    };
  }, [isMobile]);

  /** Handle the touch event on mobile. Intercept every touch event to prevent the brick to receive their native event */
  const handleTouchEvent = (e: TouchEvent | PointerEvent | MouseEvent) => {
    if (e.type === "click" && !focusedBrick) {
      const event = e as MouseEvent;
      setFocusedBrick(getBrickAtPosition(event.x, event.y));
    }
    if (e.type !== "click") e.stopPropagation();
  };

  /** When a brick is focused, we want to center it on the screen, and scale it to fit the screen */
  useEffect(() => {
    if (focusedBrick) {
      const domBrick = document.querySelector(`article[data-node-id="${focusedBrick.id}"`);
      if (!domBrick) return;

      const currentDeviceRatio = globalThis.innerWidth / globalThis.innerHeight;
      // Because the dev containing the bricks is scaled, we have to calculate the real width and height of the focused brick
      const realWidth = focusedBrick.width * contentScale;
      const realHeight = focusedBrick.height * contentScale;

      // Calculate the scaling factor to fit the brick in the screen. Width by default, or height if the brick is too tall
      const scaling = currentDeviceRatio < realWidth / realHeight ? globalThis.innerWidth / realWidth : globalThis.innerHeight / realHeight;

      const xPos = 0;
      // Get the Y position to center the brick on the screen.
      const yPos = (globalThis.innerHeight - CONTENT_MARGIN - realHeight) / 2;

      (domBrick as HTMLElement).style.setProperty("--focus-x", `${xPos}px`);
      (domBrick as HTMLElement).style.setProperty("--focus-y", `${yPos}px`);
      (domBrick as HTMLElement).style.setProperty("--focus-scale", `${scaling}`);
      (domBrick as HTMLElement).style.zIndex = "91";
    }
  }, [focusedBrick]);

  /** Remove the focus on the brick, so all the styles are reset. Use styles to get native css animations */
  const removeFocus = useCallback(() => {
    if (focusedBrick) {
      const domBrick = document.querySelector(`article[data-node-id="${focusedBrick.id}"`);
      if (!domBrick) return;
      (domBrick as HTMLElement).style.setProperty("--focus-x", "initial");
      (domBrick as HTMLElement).style.setProperty("--focus-y", "initial");
      (domBrick as HTMLElement).style.setProperty("--focus-scale", "initial");
      // Hack to keep the brick on top of the other ones, just the time of the scale animation
      setTimeout(() => ((domBrick as HTMLElement).style.zIndex = "initial"), 500);
    }
    setFocusedBrick(undefined);
  }, [focusedBrick?.id]);

  return renderedNodes ? (
    <>
      {/** Hero section */}
      {!isMobile && <div className={`h-screen w-full`}>{HeroSection}</div>}

      {/* Overlay on mobile, to intercept the user interaction */}
      {isMobile && (
        <div
          ref={mobileOverlayRef}
          className={cn("absolute top-0 left-0 w-full z-[90] transition-opacity duration-300", focusedBrick ? "pointer-events-none" : "pointer-events-auto")}
          style={{
            height: `${fullHeight}px`,
          }}
          // Intercept the "clicks" on the overlay
          onPointerDown={handleTouchEvent}
          onClick={handleTouchEvent}
          onTouchStart={handleTouchEvent}
          onTouchMove={handleTouchEvent}
          onTouchEnd={handleTouchEvent}
        ></div>
      )}

      {/** Actual bricks layout */}
      <div
        className={cn(`w-full origin-top-left`, focusedBrick ? "z-[91]" : "z-[initial]")}
        style={{
          height: `${fullHeight}px`,
          marginTop: `${CONTENT_MARGIN}px`,
          marginBottom: `${CONTENT_MARGIN}px`,
          transform: `scale(${contentScale})`,
        }}
      >
        {/* Background when a brick is focused, to make the other bricks less visible and intercept the clicks */}
        {focusedBrick && (
          <div
            className={"absolute top-0 left-0 bg-black bg-opacity-80 z-10"}
            style={{
              // Divide by the content scale to get the real size of the overlay (scaled by his parent)
              width: `${fullWidth / contentScale}px`,
              height: `${fullHeight / contentScale}px`,
            }}
            onClick={removeFocus}
          ></div>
        )}
        {renderedNodes.map((node) => {
          return (
            <article
              data-node-id={node.id}
              className={"absolute transition-transform origin-top-left ease-in-out duration-300"}
              style={{
                "--focus-x": `initial`,
                "--focus-y": `initial`,
                "--focus-scale": `initial`,
                width: `${node.width}px`,
                height: `${node.height}px`,
                "--offset-x": `var(--focus-x, ${node.x}px)`,
                "--offset-y": `var(--focus-y, ${node.y}px)`,
                transform: `translate3d(var(--offset-x), var(--offset-y), 0) scale(var(--focus-scale, 1))`,
              }}
            >
              {getBrickFromCanvaNode(node, { brickSize: { width: node.width, height: node.height } })}
            </article>
          );
        })}
      </div>

      {/* Close button when a brick is focused */}
      {focusedBrick && (
        <div class={"z-[92] absolute top-2 right-2 p-1 rounded-full bg-black"} onClick={removeFocus}>
          <IconX class="text-text w-8 h-8" />
        </div>
      )}
    </>
  ) : null;
}
