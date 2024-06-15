import { computed, effect, Signal, signal } from "@preact/signals-core";

import { createContext, createRef, Ref, RefObject, VNode } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { MNode } from "@models/Canva.ts";
import { getBaseUrl } from "@utils/pathHandler.ts";

type MCViewBox = { x: number; y: number; scale: number };

type rectCollideProps = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type MNodeContextType = {
  MCFrame: Signal<RefObject<HTMLElement>>;
  setMCFrame: (ref: Ref<HTMLElement>) => void;
  viewBox: Signal<MCViewBox>;
  setViewBox: (viewBox: MCViewBox) => void;
  MCNodes: Signal<MNode[]>;
  isOverlapping: (a: rectCollideProps) => boolean | MNode | undefined;
  saveNode: (node: MNode) => void;
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

  effect(() => {
    fetch(getBaseUrl() + "/api/node/getAll")
      .then((res) => res ? res.json() : []).then((data) => MCNodes.value = data).catch(
        (e) => {
          console.error(e);
          return [];
        },
      );
  });

  const saveNode = (node: MNode) => {
    const nodeIndex = MCNodes.value.findIndex(n => n.id === node.id)
    if (nodeIndex !== -1){
      MCNodes.value[nodeIndex] = node
    } else {
      MCNodes.value = [...MCNodes.value, node]
    }
  }

  const isOverlapping = (a: rectCollideProps) => {
    console.log(a, MCNodes.value);
    const res = MCNodes.value.find((n) => {
      if (n.id === a.id) return false;
      const b = {
        x1: n.x,
        y1: n.y,
        x2: n.x + n.width,
        y2: n.y + n.height,
      };
      return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
    })
    console.log(res);
    return res;
  }

  const value = {
    MCFrame: MCFrame,
    setMCFrame: setMCFrame,
    viewBox: viewBox,
    setViewBox: setViewBox,
    MCNodes: computed(() => MCNodes.value),
    isOverlapping: (a: rectCollideProps) => isOverlapping(a),
    saveNode: saveNode,
  };

  return (
    <MNodeContext.Provider value={value}>
      {children}
    </MNodeContext.Provider>
  );
};