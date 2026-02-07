import { MNode } from "@models/Canva.ts";
import { signal } from "@preact/signals";
import { Ref } from "preact/hooks";

import { getBrickFromCanvaNode } from "@utils/bricks.tsx";
import { createRef } from "preact";

type MNodeGenProps = {
  node: MNode;
};

export default function Node({ node }: MNodeGenProps) {
  const MNodeRef = signal<Ref<SVGForeignObjectElement>>(createRef());

  return (
    <foreignObject
      className={"group select-none overflow-visible"}
      ref={MNodeRef.value}
      width={node.width}
      height={node.height}
      x={node.x}
      y={node.y}
    >
      {getBrickFromCanvaNode(node, {})}
    </foreignObject>
  );
}
