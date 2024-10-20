import Dropdown from "@islands/Dropdown.tsx";
import CreateBrickBar from "@islands/pages/CreateBrickBar.tsx";
import { availBricks, BricksType, getBrickTypeLabel } from "@models/Bricks.ts";
import { useEffect, useState } from "preact/hooks";
import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { cn } from "@utils/cn.ts";
import { useToast } from "@hooks/toast.tsx";

type BrickSidebarProps = {};

type activeAvailType = availBricks & { isActive: boolean };

// Default is the value of the key of BricksType.Single
const defaultBrick = BricksType.Album;

function getKeyByValue<T extends Record<string, unknown>, U extends T[keyof T]>(
  object: T,
  value: U,
): keyof T | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function BrickSidebar({}: BrickSidebarProps) {
  const [bricksDDItems, setBricksDDItems] = useState(
    Object.entries(BricksType).map(([key, val]: [string, BricksType]) => {
      return {
        id: key,
        value: val,
        label: getBrickTypeLabel(val),
        isActive: val === defaultBrick,
        onClick: () => onItemClick(val),
      };
    }),
  );
  const [createBrickType, setCreateBrickType] = useState<BricksType>(
    defaultBrick,
  );
  const [userBricks, setUserBricks] = useState<activeAvailType[]>([]);

  const { nodesChanged, isPreview } = useMNodeContext();
  const { toast } = useToast();

  useEffect(() => {
    const savedBricksTable = getKeyByValue(BricksType, createBrickType);
    if (savedBricksTable) {
      fetch(`/api/brick/getUserBricks/${savedBricksTable}`)
        .then((res) => res && res.json())
        .then((data: availBricks[]) => {
          setUserBricks(
            Array.isArray(data)
              ? data.map((d) => ({ ...d, isActive: false }))
              : [],
          );
        });
    }
  }, [createBrickType]);

  useEffect(() => {
    if (nodesChanged) {
      const savedBricksTable = getKeyByValue(BricksType, createBrickType);
      fetch(`/api/brick/getUserBricks/${savedBricksTable}`)
        .then((res) => res && res.json())
        .then((data: availBricks[]) => {
          setUserBricks(
            Array.isArray(data)
              ? data.map((d) => ({ ...d, isActive: false }))
              : [],
          );
        });
    }
  }, [nodesChanged]);

  const onItemClick = (val: BricksType) => {
    setCreateBrickType(val);
    setBricksDDItems(
      bricksDDItems.map((brick) => ({
        ...brick,
        isActive: brick.value === val,
      })),
    );
  };

  const onBrickClick = (brick?: activeAvailType) => {
    setUserBricks(
      userBricks.map((b) => ({
        ...b,
        isActive: b.id === (brick ? brick.id : -1),
      })),
    );
  };

  /** Highlight the node in the canvas when hovering over the brick in the sidebar */
  const onItemHover = (action: "enter" | "leave", id: string | number) => {
    const el = document.querySelector("#mcanva-article-placeholder[data-node-id='" + id + "']")
    if (el) {
      if (action === "enter") el.classList.add("node-highlight")
      if (action === "leave") el.classList.remove("node-highlight")
    }
  }

  // When CreateBrickBar calls this function, it will pass an empty brick (on delete, or on create)
  const handleSetBrick = (brick: availBricks | undefined) => {
    onBrickClick(brick as activeAvailType);
  };

  return (
    <div class={cn("w-[200px] h-full flex-col justify-start items-start gap-6 inline-flex relative")}>
      {isPreview && 
        <div 
          className={"absolute inset-0 bg-background opacity-60"}
          onClick={() => toast({
            title: "Warning",
            description: "You can't create or modify bricks in preview mode. Please exit preview mode to manage bricks.",
          })} 
        />}
      <div class="w-full flex flex-col gap-2">
        {/* Brick type Dropdown */}
        <Dropdown items={bricksDDItems} activeInDropdown />

        {/* User-created bricks of the chosen type */}
        <Dropdown
          items={[
            ...userBricks.map((b) => ({
              id: b.id.toString(),
              label: b.name,
              value: b.id.toString(),
              onClick: () => onBrickClick(b),
              ...(b.nodeId && { onMouseEnter: (e: MouseEvent, id: string | number) => onItemHover("enter", b.nodeId as string)}),
              ...(b.nodeId && { onMouseLeave: (e: MouseEvent, id: string | number) => onItemHover("leave", b.nodeId as string)}),
              isActive: b.isActive,
            })),
            {
              id: "create",
              label: "Créer une nouvelle brique",
              value: "create",
              onClick: () => onBrickClick(),
            },
          ]}
          activeInDropdown
        />
      </div>
      <CreateBrickBar
        brickType={createBrickType}
        brickData={userBricks.find((b) => b.isActive)}
        setBrick={handleSetBrick} // Pass the callback function as a prop
      />
    </div>
  );
}
