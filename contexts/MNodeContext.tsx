import { computed, effect, Signal, signal } from "@preact/signals-core";

import { createContext, createRef, Ref, RefObject, VNode } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { CANVA_GUTTER, MNode } from "@models/Canva.ts";
import { getBaseUrl } from "@utils/pathHandler.ts";

type MCViewBox = {
  x: number;
  y: number;
  scale: number;
  width?: number;
  height?: number;
};

type isOverlappingType = {
  isOverlapping: boolean;
  overlappingNode: MNode[];
};

type rectCollideProps = {
  id?: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type getClosestFreePositionReturnType = (
  a: rectCollideProps,
  overlap: isOverlappingType,
) => rectCollideProps;

type MNodeContextType = {
  MCFrame: Signal<RefObject<HTMLElement>>;
  setMCFrame: (ref: Ref<HTMLElement>) => void;
  viewBox: Signal<MCViewBox>;
  setViewBox: (viewBox: MCViewBox) => void;
  MCNodes: Signal<MNode[]>;
  isOverlapping: (a: rectCollideProps) => isOverlappingType;
  getClosestFreePosition: getClosestFreePositionReturnType;
  getFreeSpace: (a: rectCollideProps) => rectCollideProps;
  saveNode: (node: MNode) => void;
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
};

// const asyncGnal = function<T>(defaultValue: T, callback: () => Promise<T>): ReadonlySignal<T> {
//   const s = signal(defaultValue);
//   effect(() => callback().then((v) => s.value = v));
//   return computed(() => s.value);
// };

// Create the MNode context
const MNodeContext = createContext<MNodeContextType>(
  {} as MNodeContextType,
);

export const useMNodeContext = () => {
  return useContext(MNodeContext);
};

export const MNodeProvider = ({ children }: { children: VNode }) => {
  const MCFrame = signal<RefObject<HTMLElement>>(createRef());
  const setMCFrame = (ref: Ref<HTMLElement>) =>
    MCFrame.value = ref as RefObject<HTMLElement>;
  const viewBox = signal<MCViewBox>({ x: 0, y: 0, scale: 1 });
  const setViewBox = (viewBoxVal: MCViewBox) => viewBox.value = viewBoxVal;
  const MCNodes = signal<MNode[]>([]);
  const isPreview = signal<boolean>(false);
  const setPreview = (preview: boolean) => isPreview.value = preview;

  useEffect(() => {
    if (MCFrame.value.current && viewBox) {
      const width = MCFrame.value.current?.clientWidth || 0;
      const height = MCFrame.value.current?.clientHeight || 0;
      viewBox.value = { ...viewBox.value, width: width, height: height };
    }
  }, [MCFrame.value]);

  effect(() => {
    fetch(getBaseUrl() + "/api/node/getAll")
      .then((res) => {
        if (res) {
          return res.json();
        }
        console.error("No response from server: ", res);
        return [];
      }).then((data: MNode[]) => MCNodes.value = data).catch(
        (e) => {
          console.error(e);
          return [];
        },
      );
  });

  effect(() => Boolean(MCNodes.value.length) && console.log(MCNodes.value));

  const saveNode = (node: MNode) => {
    const nodeIndex = MCNodes.value.findIndex((n) => n.id === node.id);
    if (nodeIndex !== -1) {
      MCNodes.value[nodeIndex] = node;
    } else {
      MCNodes.value = [...MCNodes.value, node];
    }
  };

  const MAX_RECURSION_DEPTH = 10;
  const getFreeSpace = (
    a: rectCollideProps,
    depth?: number,
  ): rectCollideProps => {
    if (depth === undefined) depth = 0;
    if (depth > MAX_RECURSION_DEPTH) return a;

    const overlap = isOverlapping(a);

    if (overlap.isOverlapping) {
      const newRect = getClosestFreePosition(a, overlap);
      return getFreeSpace(newRect, depth + 1);
    } else return a;
  };

  const isOverlapping = (a: rectCollideProps): isOverlappingType => {
    const nodes = MCNodes.value.filter((n) => {
      if (n.id === a.id) return false;
      const b = {
        x1: n.x - CANVA_GUTTER,
        y1: n.y - CANVA_GUTTER,
        x2: n.x + n.width + CANVA_GUTTER,
        y2: n.y + n.height + CANVA_GUTTER,
      };
      return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
    });
    return { isOverlapping: nodes.length > 0, overlappingNode: nodes };
  };

  const getClosestFreePosition: getClosestFreePositionReturnType = (
    a,
    overlap,
  ) => {
    const singleNode = overlap.overlappingNode[0];

    if (!overlap.isOverlapping || !singleNode) {
      console.error("Nodes are not overlapping, cannot calculate space");
      return a;
    }

    const b = {
      x1: singleNode.x,
      y1: singleNode.y,
      x2: singleNode.x + singleNode.width,
      y2: singleNode.y + singleNode.height,
    };

    // Add distance
    const closestX = (): { pos: number; dist: number } => {
      // console.log("a: ", JSON.stringify(a), "b: ", JSON.stringify(b));
      if (a.x1 < b.x1 && a.x2 <= b.x2) {
        const min = Math.min(...[
          Math.abs(a.x1 - b.x1),
          Math.abs(a.x1 - b.x2),
          Math.abs(a.x2 - b.x1),
        ]);
        // console.log("Left Min: ", min);
        return { pos: b.x1, dist: min };
      }
      if (a.x2 > b.x2 && a.x1 >= b.x1) {
        const min = Math.min(...[
          Math.abs(a.x2 - b.x2),
          Math.abs(a.x1 - b.x2),
          Math.abs(a.x2 - b.x1),
        ]);
        // console.log("Right Min: ", min);
        return { pos: b.x2, dist: min };
      }
      return { pos: a.x1, dist: -1 };
    };

    const closestY = (): { pos: number; dist: number } => {
      if (a.y2 < b.y2 && a.y1 <= b.y1) {
        const min = Math.min(...[
          Math.abs(a.y1 - b.y2),
          Math.abs(a.y2 - b.y1),
        ]);
        // console.log("Top Min: ", min);
        return { pos: b.y1, dist: min };
      }
      if (a.y1 > b.y1 && a.y2 >= b.y2) {
        const min = Math.min(...[
          Math.abs(a.y1 - b.y2),
          Math.abs(a.y2 - b.y1),
        ]);
        // console.log("Bottom Min: ", min);
        return { pos: b.y2, dist: min };
      }
      // return a.y1;
      return { pos: a.y1, dist: -1 };
    };

    const rectPos = { x: closestX(), y: closestY() };

    // console.log("Closest: ", JSON.stringify(rectPos));

    const getReturnedPos = (): { x: number; y: number } => {
      if (
        ((rectPos.x.dist < rectPos.y.dist) && rectPos.x.dist !== -1) ||
        rectPos.y.dist === -1
      ) {
        const pos = {
          x: a.x1 > b.x1 ? rectPos.x.pos + CANVA_GUTTER : rectPos.x.pos - (a.x2 - a.x1) - CANVA_GUTTER,
          y: a.y1,
        };
        // console.log("X is closer: ", pos);
        return pos;
      }
      const pos = {
        x: a.x1,
        y: a.y1 > b.y1 ? rectPos.y.pos + CANVA_GUTTER : rectPos.y.pos - (a.y2 - a.y1) - CANVA_GUTTER,
      };
      return pos;
    };

    const newPos = getReturnedPos();
    return {
      id: a.id,
      x1: newPos.x,
      y1: newPos.y,
      x2: newPos.x + (a.x2 - a.x1),
      y2: newPos.y + (a.y2 - a.y1),
    };
  };

  const value = {
    MCFrame: MCFrame,
    setMCFrame: setMCFrame,
    viewBox: viewBox,
    setViewBox: setViewBox,
    MCNodes: computed(() => MCNodes.value),
    isOverlapping,
    getClosestFreePosition,
    getFreeSpace,
    saveNode: saveNode,
    isPreview: isPreview.value,
    setPreview: setPreview,
  };

  return (
    <MNodeContext.Provider value={value}>
      {children}
    </MNodeContext.Provider>
  );
};
