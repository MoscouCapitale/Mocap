import { computed, effect, Signal, signal } from "@preact/signals-core";

import { createContext, createRef, Ref, RefObject, VNode } from "preact";
import { StateUpdater, useCallback, useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CANVA_GUTTER, MNode, TRASH_DEADZONE_MULTIPLIER } from "@models/Canva.ts";
import { getBaseUrl } from "@utils/pathHandler.ts";
import { BricksType } from "@models/Bricks.ts";
import { merge } from "lodash";

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

type getClosestFreePositionReturnType = (a: rectCollideProps, overlap: isOverlappingType) => rectCollideProps;

type SaveNodeProps = {
  node: MNode;
  rerender?: boolean;
  partial?: boolean;
};

type MNodeContextType = {
  MCFrame: RefObject<SVGSVGElement>;
  viewBox?: MCViewBox;
  setViewBox: (viewBox: MCViewBox) => void;
  MCNodes: MNode[];
  isOverlapping: (a: rectCollideProps) => isOverlappingType;
  getClosestFreePosition: getClosestFreePositionReturnType;
  getFreeSpace: (a: rectCollideProps) => rectCollideProps;
  saveNode: (props: SaveNodeProps) => void;
  deleteNode: (nodeId: string) => Promise<void>;
  isPreview: boolean;
  setPreview: (preview: boolean) => void;
  refetchNodes: () => void;
  autoSaved: boolean;
  writeNodes: () => void;
  nodesChanged: boolean;
  hasPendingChanges: boolean;
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

type UpsertNodeToNodesArrayProps =
  | {
      /** If strategy is `merge`, we only need to provide a partial node with the id */
      strategy: "merge";
      nodes: MNode[];
      node: Partial<MNode> & { id: string };
    }
  | {
      nodes: MNode[];
      node: MNode;
      strategy?: "overwrite";
    };

/** Update the nodes array with the provided node.
 *
 * @param {MNode[]} nodes - The nodes array to update
 * @param {MNode} node - The node to update
 * @param {"overwrite" | "merge"} strategy - The strategy to use. Use `overwrite` to replace the node, `merge` to merge the node with the existing one. Default is `overwrite`
 * @param {boolean} mutate - Whether to mutate the nodes array or not. Used for, in state, to avoid triggering a re-render. Default is false.
 */
const upsertNodeToNodesArray = ({ nodes, node, strategy = "overwrite" }: UpsertNodeToNodesArrayProps) => {
  const isNodeIn = Boolean(nodes.find((n) => n.id === node.id));

  if (isNodeIn) {
    return nodes.map((n) => {
      if (n.id === node.id) {
        if (strategy === "overwrite") return node;
        if (strategy === "merge") return merge(n, node);
      }
      return n;
    });
  } else {
    return [...nodes, node];
  }
};

// Create the MNode context
const MNodeContext = createContext<MNodeContextType>({} as MNodeContextType);

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

  // Trigger a nodesChanged when a node is added/removed
  const [nodesChanged, setNodesChanged] = useState(false);
  effect(() => setTimeout(() => nodesChanged && setNodesChanged(false), 100));

  useEffect(() => {
    if (MCNodes.length > 0 && MCNodes.find((n) => n.type === BricksType.HeroSection)) {
      setMCNodes((prev) => {
        let isModified = false;
        const calc = prev.map((node) => {
          if (node.type === BricksType.HeroSection) {
            const size = prev.reduce(
              (acc, n) => {
                if (n.id === node.id) return acc;
                if (n.x < acc.x1) acc.x1 = n.x;
                if (n.x + n.width > acc.x2) acc.x2 = n.x + n.width;
                return acc;
              },
              { x1: 999999, x2: -999999 }
            );
            if (node.x !== size.x1 || node.width !== size.x2 - size.x1) {
              isModified = true;
            }
            node.x = size.x1;
            node.width = size.x2 - size.x1;
            node.height = 400; // TODO: better way to handle this, instead of hardcoded height
          }
          return node;
        });
        return isModified ? calc : prev;
      });
    }
  }, [MCNodes]);

  // #region AutoSave management
  const autoSave = signal<autoSaveType>({
    timeout: 30 * 1000, // 30 seconds
    triggerTimeout: false,
  });
  const [autoSaved, setAutoSaved] = useState(false);

  effect(() => {
    if (hasPendingChanges && !autoSave.value.triggerTimeout && !autoSaved) {
      autoSave.value.triggerTimeout = true;
    }
  });

  effect(() => {
    if (autoSaved) {
      setTimeout(() => setAutoSaved(false), 5000);
    }
  });

  useEffect(() => {
    if (autoSave.value.triggerTimeout) {
      autoSave.value.triggerTimeout = false;
      const to = setTimeout(() => writeNodes(), autoSave.value.timeout);
      return () => {
        clearTimeout(to);
      };
    }
  }, [autoSave, MCNodes]);

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
        frameHeight: height,
      });
    }
  }, [MCFrame]);

  // #region Fetch and save nodes
  useEffect(() => {
    let isMounted = true;

    fetch("/api/node/getAll?force=true")
      .then((res) => {
        if (res) {
          return res.json();
        }
        console.error("No response from server: ", res);
        return [];
      })
      .then((data: MNode[]) => {
        if (isMounted && MCNodes.length === 0) {
          // setMCNodes(applyAdditionalMNodeLogic(data));
          setMCNodes(data);
        }
      })
      .catch((e) => {
        console.error(e);
        return [];
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refetchNodes = () => {
    fetch("/api/node/getAll?force=true")
      .then((res) => {
        if (res) {
          return res.json();
        }
        console.error("No response from server: ", res);
        return [];
      })
      .then((data: MNode[]) => {
        setMCNodes(data);
      })
      .catch((e) => {
        console.error(e);
        return [];
      });
  };

  /**
   * Save a single node to the context MCNode
   *
   * @param {MNode} node - The node to save
   * @param {boolean} rerender - Whether to rerender the node. If true, all nodes will be re-render. If false, the state will be updated in a non-reactive way. Default is false.
   */
  const saveNode = ({ node, rerender = false, partial }: SaveNodeProps) => {
    console.log("Saving node: ", node)
    if (!hasPendingChanges) setHasPendingChanges(true);
    if (rerender) {
      setMCNodes((prev) => {
        const res = upsertNodeToNodesArray({ nodes: prev, node, strategy: partial ? "merge" : "overwrite" })
        console.log("result of upserting: ", res)
        return res
    });
      setNodesChanged(true);
    } else {
      setMCNodes((prev) => {
        setNodesChanged(true);
        const nodeIndex = prev.findIndex((n) => n.id === node.id);
        if (nodeIndex !== -1) {
          prev[nodeIndex] = node;
          return prev;
        } else {
          return [...prev, node];
        }
      });
    }
    autoSave.value = { ...autoSave.value, triggerTimeout: true };
  };

  const deleteNode = async (nodeId: string) => {
    const nodeIndex = MCNodes.findIndex((n) => n.id === nodeId);
    if (hasPendingChanges) setHasPendingChanges(false);
    if (nodeIndex !== -1) {
      try {
        const res = await fetch(`/api/node/${nodeId}`, { method: "DELETE" });
        if (res.status === 204) {
          setMCNodes([...MCNodes.slice(0, nodeIndex), ...MCNodes.slice(nodeIndex + 1)]);
          setNodesChanged(true);
        } else throw new Error(`Generic error while deleting node ${nodeId}`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  /** Save the nodes to the server.
   *
   * @param {MNode[]} nodes - The nodes to save. If not provided, it will save all nodes in the context.
   */
  const writeNodes = useCallback(
    (nodes?: MNode[]) => {
      const nodesToSave = nodes || MCNodes;
      if (hasPendingChanges) setHasPendingChanges(false);
      fetch(getBaseUrl() + "/api/node", {
        method: "PUT",
        body: JSON.stringify({ nodes: nodesToSave }),
      }).then((res) => {
        if (res.status) {
          setHasPendingChanges(false);
          setAutoSaved(true);
        }
      });
    },
    [MCNodes]
  );

  // #region Overlap management
  const MAX_RECURSION_DEPTH = 10;
  const getFreeSpace = (a: rectCollideProps, depth?: number): rectCollideProps => {
    if (depth === undefined) depth = 0;
    if (depth > MAX_RECURSION_DEPTH) return a;

    const overlap = isOverlapping(a);

    if (overlap.isOverlapping) {
      const newRect = getClosestFreePosition(a, overlap);
      return getFreeSpace(newRect, depth + 1);
    } else return a;
  };

  const isOverlapping = useCallback(
    (a: rectCollideProps): isOverlappingType => {
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
    },
    [MCNodes]
  );

  const getClosestFreePosition: getClosestFreePositionReturnType = (a, overlap) => {
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
        const min = Math.min(...[Math.abs(a.x1 - b.x1), Math.abs(a.x1 - b.x2), Math.abs(a.x2 - b.x1)]);
        // console.log("Left Min: ", min);
        return { pos: b.x1, dist: min };
      }
      if (a.x2 > b.x2 && a.x1 >= b.x1) {
        const min = Math.min(...[Math.abs(a.x2 - b.x2), Math.abs(a.x1 - b.x2), Math.abs(a.x2 - b.x1)]);
        // console.log("Right Min: ", min);
        return { pos: b.x2, dist: min };
      }
      return { pos: a.x1, dist: -1 };
    };

    const closestY = (): { pos: number; dist: number } => {
      if (a.y2 < b.y2 && a.y1 <= b.y1) {
        const min = Math.min(...[Math.abs(a.y1 - b.y2), Math.abs(a.y2 - b.y1)]);
        // console.log("Top Min: ", min);
        return { pos: b.y1, dist: min };
      }
      if (a.y1 > b.y1 && a.y2 >= b.y2) {
        const min = Math.min(...[Math.abs(a.y1 - b.y2), Math.abs(a.y2 - b.y1)]);
        // console.log("Bottom Min: ", min);
        return { pos: b.y2, dist: min };
      }
      // return a.y1;
      return { pos: a.y1, dist: -1 };
    };

    const rectPos = { x: closestX(), y: closestY() };

    // console.log("Closest: ", JSON.stringify(rectPos));

    const getReturnedPos = (): { x: number; y: number } => {
      if ((rectPos.x.dist < rectPos.y.dist && rectPos.x.dist !== -1) || rectPos.y.dist === -1) {
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

  const value = useMemo(
    () => ({
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
      autoSaved,
      writeNodes,
      nodesChanged,
      hasPendingChanges,
    }),
    [MCFrame, viewBox, MCNodes, isPreview, nodesChanged, hasPendingChanges, autoSaved]
  );

  return <MNodeContext.Provider value={value}>{children}</MNodeContext.Provider>;
};
