import { computed, effect, Signal, signal } from "@preact/signals-core";

import { createContext, createRef, Ref, RefObject, VNode } from "preact";
import {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import {
  CANVA_GUTTER,
  MNode,
  TRASH_DEADZONE_MULTIPLIER,
} from "@models/Canva.ts";
import { getBaseUrl } from "@utils/pathHandler.ts";
import { canParse } from "https://deno.land/std@0.216.0/semver/can_parse.ts";
import { BricksType } from "@models/Bricks.ts";

export type MCViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  frameWidth: number; // Width of the svg frame. Is clientWidth
  frameHeight: number; // Height of the svg frame. Is clientHeight
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

type trashPosType = {
  x: number;
  y: number;
  isReady: boolean;
  nodeOverTrash?: string;
};

type autoSaveType = {
  timeout: number;
  triggerTimeout: boolean;
  savedMessage?: string;
  currentTimer?: any; // TODO: find this type
};

type getClosestFreePositionReturnType = (
  a: rectCollideProps,
  overlap: isOverlappingType,
) => rectCollideProps;

type MNodeContextType = {
  MCFrame: RefObject<SVGSVGElement>;
  viewBox?: MCViewBox;
  setViewBox: (viewBox: MCViewBox) => void;
  MCNodes: MNode[];
  isOverlapping: (a: rectCollideProps) => isOverlappingType;
  getClosestFreePosition: getClosestFreePositionReturnType;
  getFreeSpace: (a: rectCollideProps) => rectCollideProps;
  saveNode: (node: MNode, rerender?: boolean) => void;
  deleteNode: (nodeId: string) => void;
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
  refetchNodes: () => void;
  trashPos: trashPosType;
  setNodeOverTrash: (nodeId: string) => void; // TODO: use it for animation ?
  autoSaveMessage?: Signal<string | undefined>;
  writeNodes: () => void;
  nodesChanged: boolean;
  hasPendingChanges: boolean;
  getHeroSectionXPos: () => { x1: number; x2: number };
};

// const asyncGnal = function<T>(defaultValue: T, callback: () => Promise<T>): ReadonlySignal<T> {
//   const s = signal(defaultValue);
//   effect(() => callback().then((v) => s.value = v));
//   return computed(() => s.value);
// };

// /**
//  * Updates the state using the provided state updater function.
//  * If a value is provided, it sets the state to that value.
//  * If an apply function is provided, it applies the function to the previous state before updating.
//  *
//  * @param stateUpdater - The state updater function.
//  * @param val - The value to set the state to.
//  * @param applyFunc - The function to apply to the previous state before updating.
//  */
// function setState<T>(stateUpdater: StateUpdater<T>, val?: T, applyFunc?: (prev: T) => T) {
//   if (applyFunc) stateUpdater(applyFunc);
//   if (val) stateUpdater(val);
// }

// Create the MNode context
const MNodeContext = createContext<MNodeContextType>(
  {} as MNodeContextType,
);

export const useMNodeContext = () => {
  return useContext(MNodeContext);
};

export const MNodeProvider = ({ children }: { children: VNode }) => {
  const MCFrame = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState<MCViewBox>();
  const [MCNodes, setMCNodes] = useState<MNode[]>([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const setPreview = (preview: boolean) => setIsPreview(preview);
  const [trashPos, setTrashPos] = useState<trashPosType>({
    x: 0,
    y: 0,
    isReady: false,
  });

  // Trigger a nodesChanged when a node is added/removed
  const [nodesChanged, setNodesChanged] = useState(false);
  effect(() => setTimeout(() => nodesChanged && setNodesChanged(false), 100));

  const applyAdditionalMNodeLogic = (data: MNode[]): MNode[] => {
    return data.map((node) => {
      if (node.type === BricksType.HeroSection) {
        const size = getHeroSectionXPos(data);
        node.x = size.x1;
        node.width = size.x2 - size.x1;
        node.height = 400; // TODO: better way to handle this, instead of hardcoded height
      }
      return node;
    });
  };

  const autoSave = signal<autoSaveType>({
    timeout: 30 * 1000, // 30 seconds
    triggerTimeout: false,
  });
  const autoSaveMessage = signal<string | undefined>(undefined);

  const getHeroSectionXPos = useCallback((nodes?: MNode[]) => {
    const dimensions = { x1: Infinity, x2: -Infinity };
    (nodes ?? MCNodes).forEach((n) => {
      if (n.x > 0 && n.x < dimensions.x1) dimensions.x1 = n.x;
      if (n.x + n.width > dimensions.x2) dimensions.x2 = n.x + n.width;
    });
    return dimensions;
  }, [MCNodes]);

  useEffect(() => {
    if (MCFrame.current) {
      const width = MCFrame.current?.clientWidth || 0;
      const height = MCFrame.current?.clientHeight || 0;
      setViewBox({ 
        x: 0,
        y: 0,
        width,
        height,
        frameWidth: width, 
        frameHeight: height 
      });
    }
  }, [MCFrame]);

  useEffect(() => {
    let isMounted = true;

    fetch(getBaseUrl() + "/api/node/getAll?force=true")
      .then((res) => {
        if (res) {
          return res.json();
        }
        console.error("No response from server: ", res);
        return [];
      }).then((data: MNode[]) => {
        if (isMounted && MCNodes.length === 0) {
          setMCNodes(applyAdditionalMNodeLogic(data));
        }
      }).catch(
        (e) => {
          console.error(e);
          return [];
        },
      );

    return () => {
      isMounted = false;
    };
  }, []);

  const refetchNodes = () => {
    fetch(getBaseUrl() + "/api/node/getAll?force=true")
      .then((res) => {
        if (res) {
          return res.json();
        }
        console.error("No response from server: ", res);
        return [];
      }).then((data: MNode[]) => {
        setMCNodes(applyAdditionalMNodeLogic(data));
      }).catch(
        (e) => {
          console.error(e);
          return [];
        },
      );
  };

  useEffect(() => {
    if (
      MCFrame.current?.clientWidth && MCFrame.current?.clientHeight &&
      !trashPos.isReady
    ) {
      const trash = {
        x: MCFrame.current.clientWidth -
          (MCFrame.current.clientWidth * TRASH_DEADZONE_MULTIPLIER),
        y: MCFrame.current.clientHeight -
          (MCFrame.current.clientHeight * TRASH_DEADZONE_MULTIPLIER),
      };
      setTrashPos({ x: trash.x, y: trash.y, isReady: true });
    }
  }, [MCFrame.current]);

  const setNodeOverTrash = (nodeId: string) => {
    setTrashPos((prev) => {
      return { ...prev, nodeOverTrash: nodeId };
    });
  };

  /**
   * Save a single node to the context MCNode
   *
   * @param {MNode} node - The node to save
   * @param {boolean} rerender - Whether to rerender the node. If true, all nodes w<ill be re-render. If false, the state will be updated in a non-reactive way. Default is false.
   */
  const saveNode = (node: MNode, rerender = false) => {
    if (!hasPendingChanges) setHasPendingChanges(true);
    if (rerender) {
      const nodeIndex = MCNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        setMCNodes((prev) => [
          ...prev.slice(0, nodeIndex),
          node,
          ...prev.slice(nodeIndex + 1),
        ]);
      } else {
        setMCNodes((prev) => [...prev, node]);
        setNodesChanged(true);
      }
    } else {
      setMCNodes((prev) => {
        const nodeIndex = prev.findIndex((n) => n.id === node.id);
        if (nodeIndex !== -1) {
          prev[nodeIndex] = node;
        } else {
          setNodesChanged(true);
          return [...prev, node];
        }
        return prev;
      });
    }
    autoSave.value = { ...autoSave.value, triggerTimeout: true };
  };

  const getNode = useCallback(
    (nodeId: string) => MCNodes.find((n) => n.id === nodeId),
    [MCNodes],
  );

  const deleteNode = (nodeId: string) => {
    const nodeIndex = MCNodes.findIndex((n) => n.id === nodeId);
    if (hasPendingChanges) setHasPendingChanges(false);
    if (nodeIndex !== -1) {
      fetch(`/api/node/${nodeId}`, { method: "DELETE" }).then((res) => {
        if (res.status === 204) {
          setMCNodes([
            ...MCNodes.slice(0, nodeIndex),
            ...MCNodes.slice(nodeIndex + 1),
          ]);
          setNodesChanged(true);
        } else throw new Error(`Generic error while deleting node ${nodeId}`);
      }).catch((e) => console.error(e));
    }
  };

  const writeNodes = (nodes?: MNode[]) => {
    const nodesToSave = nodes || MCNodes;
    if (hasPendingChanges) setHasPendingChanges(false);
    fetch(getBaseUrl() + "/api/node", {
      method: "PUT",
      body: JSON.stringify({ nodes: nodesToSave }),
    }).then((res) => {
      if (res.status) {
        autoSave.value = {
          ...autoSave.value,
          triggerTimeout: false,
        };
        autoSaveMessage.value =
          `${MCNodes.length} bricks have been saved to the database`;
      }
    });
  };

  // Save nodes on autoSave trigger
  // effect(() => {
  //   if (autoSave.value.triggerTimeout) createSavingDelay();
  // });

  const timeoutSaveNodes = () => {
    autoSave.value = {
      ...autoSave.value,
      currentTimer: setTimeout(() => {
        writeNodes();
      }, autoSave.value.timeout),
    };
  };

  const createSavingDelay = () => {
    autoSave.value = { ...autoSave.value, triggerTimeout: false };
    if (autoSave.value.currentTimer) {
      clearTimeout(autoSave.value.currentTimer);
      timeoutSaveNodes();
    } else {
      timeoutSaveNodes();
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
    const nodes = MCNodes.filter((n) => {
      if (n.id === a.id) return false;
      const b = {
        x1: n.x > n.x + CANVA_GUTTER ? n.x - CANVA_GUTTER : n.x,
        y1: n.y > n.y + CANVA_GUTTER ? n.y - CANVA_GUTTER : n.y,
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
          x: a.x1 > b.x1
            ? rectPos.x.pos + CANVA_GUTTER
            : rectPos.x.pos - (a.x2 - a.x1) - CANVA_GUTTER,
          y: a.y1,
        };
        // console.log("X is closer: ", pos);
        return pos;
      }
      const pos = {
        x: a.x1,
        y: a.y1 > b.y1
          ? rectPos.y.pos + CANVA_GUTTER
          : rectPos.y.pos - (a.y2 - a.y1) - CANVA_GUTTER,
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

  const value = useMemo(() => ({
    MCFrame,
    viewBox,
    setViewBox,
    MCNodes,
    isOverlapping,
    getClosestFreePosition,
    getFreeSpace,
    saveNode,
    deleteNode,
    isPreview,
    setPreview,
    refetchNodes,
    trashPos,
    setNodeOverTrash,
    autoSaveMessage,
    writeNodes,
    nodesChanged,
    hasPendingChanges,
    getHeroSectionXPos,
  }), [
    MCFrame,
    viewBox,
    MCNodes,
    isPreview,
    trashPos,
    nodesChanged,
    hasPendingChanges,
  ]);

  return (
    <MNodeContext.Provider value={value}>
      {children}
    </MNodeContext.Provider>
  );
};
