import Node from "@islands/Bricks/Node.tsx";
import { MNode } from "@models/Canva.ts";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { VNode } from "preact";
import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import { cn } from "@utils/cn.ts";
import _ from "lodash";
import { BricksType } from "@models/Bricks.ts";

type BrickLayoutProps = {
  nodes: MNode[];
};

type LayoutCanvaSize = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

const MAX_CONTENT_WIDTH = 1000;

export default function BrickLayout({ nodes }: BrickLayoutProps) {
  useEffect(() => console.log(nodes), [nodes]);

  const [renderedNodes, setRenderedNodes] = useState<MNode[] | null>(null);

  const canvaSize: LayoutCanvaSize = useMemo(() => {
    const nodesCanvaSize = {
      x1: Infinity,
      x2: -Infinity,
      y1: Infinity,
      y2: -Infinity,
    };
    nodes.forEach((node) => {
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

  useEffect(() => console.log(canvaSize), [canvaSize]);

  const HeroSection: VNode | null = useMemo(() => {
    const heroNode = nodes.find((n) => n.type === BricksType.HeroSection);
    if (!heroNode) return null;

    return (
      <article
        // className={"w-full h-full"}
        style={{}}
      >
        {getBrickFromCanvaNode(heroNode, { asMainHeroSection: true })}
      </article>
    );
  }, [nodes]);

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
    const topOffset = -canvaSize.y1; // TODO: herosection

    if (!vw || !vh || !canvaSize) return;

    setRenderedNodes(() =>
      nodes.map((node) => {
        return {
          ...node,
          x: node.x + leftOffset,
          y: node.y + topOffset,
        };
      })
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

  return renderedNodes
    ? (
      <>
        {/** Hero section */}
        <div className={`h-screen w-full`}>
          {HeroSection}
        </div>

        {/** Actual bricks layout */}
        <div
          className={`w-full my-20`}
          style={{ height: `${Math.abs(canvaSize.y1) + canvaSize.y2}px` }}
        >
          {renderedNodes.map((node) => {
            return (
              <article
                className={"absolute"}
                style={{
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
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
