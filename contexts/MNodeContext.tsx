import { computed, effect, Signal, signal } from "@preact/signals-core";

import { createContext, createRef, Ref, RefObject, VNode } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { MNode } from "@models/Canva.ts";
import { getBaseUrl } from "@utils/pathHandler.ts";

type MCViewBox = { x: number; y: number; scale: number };

type MNodeContextType = {
  MCFrame: Signal<RefObject<HTMLElement>>;
  setMCFrame: (ref: Ref<HTMLElement>) => void;
  viewBox: Signal<MCViewBox>;
  setViewBox: (viewBox: MCViewBox) => void;
  MCNodes: Signal<MNode[]>;
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

  const value = {
    MCFrame: MCFrame,
    setMCFrame: setMCFrame,
    viewBox: viewBox,
    setViewBox: setViewBox,
    MCNodes: computed(() => MCNodes.value)
  };

  return (
    <MNodeContext.Provider value={value}>
      {children}
    </MNodeContext.Provider>
  );
};