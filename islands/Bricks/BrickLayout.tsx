import { BricksType } from "@models/Bricks.ts";
import { MNode } from "@models/Canva.ts";
import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

type BrickLayoutProps = {
  nodes: MNode[];
};

type LayoutCanvaSize = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const CONTENT_MARGIN = 80;

const followPointer = (e: PointerEvent) => {
  // Because the bricks are layed (on the x axis) from the 0, the x mouse pos is correct
  const x = (e.x).toFixed(3);
  // But the y axis is not, so we have to add the current scroll position to the y mouse pos minus the height of the bricks from the height (100vh) of the window
  const y = (e.y + (globalThis.window.scrollY - (globalThis.window.innerHeight + 80))).toFixed(3)
  globalThis.document.documentElement.style.setProperty("--mouse-x", x);
  globalThis.document.documentElement.style.setProperty("--mouse-y", y);
};

export default function BrickLayout({ nodes }: BrickLayoutProps) {
  useEffect(() => console.log(nodes), [nodes]);

  const [renderedNodes, setRenderedNodes] = useState<MNode[] | null>(null);
  const [heroSectionPos, setHeroSectionPos] = useState<
    { x: number; y: number } | null
  >();

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
      if (node.type === BricksType.HeroSection) return;
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
    });
  }, [heroSectionPos]);

  /** Calculate the coordinates the nodes
   *
   * Using the canva size (rectangle containing all the nodes), it calculate the position of the nodes
   *  depending on the screen size. We do that to make the canva centered on the screen.
   */
  const calculateRenderedNodes = useCallback(() => {
    if (!globalThis?.innerHeight || !globalThis?.innerWidth) return;

    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      globalThis.innerWidth || 0,
    );
    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      globalThis.innerHeight || 0,
    );

    const leftOffset = (vw - (canvaSize.x1 + canvaSize.x2)) / 2;
    const topOffset = -canvaSize.y1;

    setHeroSectionPos({ x: leftOffset, y: vh + CONTENT_MARGIN + topOffset });

    if (!vw || !vh || !canvaSize) return;

    setRenderedNodes(() =>
      nodes.map((node) => {
        if (node.type === BricksType.HeroSection) return null;
        return {
          ...node,
          x: node.x + leftOffset,
          y: node.y + topOffset,
        };
      }).filter(Boolean) as MNode[]
    );
  }, [globalThis?.innerHeight, globalThis?.innerWidth]);

  // TODO: this can be optimized
  // @ts-ignore - Bad lodash
  const handleResize = _.throttle(() => {
    calculateRenderedNodes();
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

  useEffect(() => {
    if (globalThis) globalThis.addEventListener("pointermove", followPointer);

    return () => {
      if (globalThis) globalThis.removeEventListener("pointermove", followPointer);
    };
  }, []);

  return renderedNodes
    ? (
      <>
        {/** Hero section */}
        <div className={`h-screen w-full`}>
          {HeroSection}
        </div>

        {/** Actual bricks layout */}
        <div
          className={`w-full`}
          style={{
            height: `${Math.abs(canvaSize.y1) + canvaSize.y2}px`,
            marginTop: `${CONTENT_MARGIN}px`,
            marginBottom: `${CONTENT_MARGIN}px`,
          }}
        >
          {renderedNodes.map((node) => {
            return (
              <article
                className={"absolute"}
                style={{
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  '--offset-x': `${node.x}px`,
                  '--offset-y': `${node.y}px`,
                  transform: `translate3d(var(--offset-x), var(--offset-y), 0)`,
                }}
              >
                {getBrickFromCanvaNode(node, {})}
              </article>
            );
          })}
        </div>
      </>
    )
    : null;
}
