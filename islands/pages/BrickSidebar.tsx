import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import CreateBrickBar from "@islands/pages/CreateBrickBar.tsx";
import Select, { SelectField } from "@islands/UI/Forms/Select.tsx";
import { availBricks, BricksType, getBrickTypeLabel } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { useEffect, useMemo, useState } from "preact/hooks";

// Default is the value of the key of BricksType.Single
const defaultBrick = BricksType.Album;

function getKeyByValue<T extends Record<string, unknown>, U extends T[keyof T]>(
  object: T,
  value: U,
): keyof T | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function BrickSidebar() {
  const [createBrickType, setCreateBrickType] = useState<BricksType>(defaultBrick);
  const bricksTypeField = useMemo<SelectField>(() => ({
    name: "bricktype",
    defaultValue: defaultBrick,
    type: "select",
    options: Object.entries(BricksType).map(([_, value]: [string, BricksType]) => ({
      value,
      label: getBrickTypeLabel(value),
    })),
  }), []);

  const [userBricks, setUserBricks] = useState<availBricks[]>();
  const bricksField = useMemo<SelectField>(() => ({
    name: "userbricks",
    type: "select",
    options: [
      ...userBricks?.map((b) => ({
        value: b.id.toString(),
        label: b.name,
        ...(b.nodeId && {
          onMouseEnter: () => onItemHover("enter", b.nodeId as string),
          onMouseLeave: () => onItemHover("leave", b.nodeId as string),
        }),
      })) ?? [],
      {
        value: "create",
        label: "Créer une nouvelle brique",
      },
    ],
  }), [userBricks]);
  const [selectedUserBrick, setSelectedUserBrick] = useState<availBricks>();

  const { nodesChanged, isPreview } = useMNodeContext();
  const { toast } = useToast();

  useEffect(() => {
    const savedBricksTable = getKeyByValue(BricksType, createBrickType);
    if (savedBricksTable) {
      fetch(`/api/brick/getUserBricks/${savedBricksTable}`)
        .then((res) => res && res.json())
        .then((data: availBricks[]) => {
          setUserBricks(Array.isArray(data) ? data : []);
        });
    }
  }, [createBrickType]);

  // TODO: Maybe find a way to optimize this ? (by retrieving only the brick that has been created/modified instead of all the bricks)
  useEffect(() => {
    if (nodesChanged) {
      const savedBricksTable = getKeyByValue(BricksType, createBrickType);
      fetch(`/api/brick/getUserBricks/${savedBricksTable}`)
        .then((res) => res && res.json())
        .then((data: availBricks[]) => {
          setUserBricks(
            Array.isArray(data) ? data : [],
          );
        });
    }
  }, [nodesChanged]);

  /** Highlight the node in the canvas when hovering over the brick in the sidebar */
  const onItemHover = (action: "enter" | "leave", id: string | number) => {
    const el = document.querySelector("#mcanva-article-placeholder[data-node-id='" + id + "']");
    if (el) {
      if (action === "enter") el.classList.add("node-highlight");
      if (action === "leave") el.classList.remove("node-highlight");
    }
  };

  // When CreateBrickBar calls this function, it will pass an empty brick (on delete, or on create)
  const handleSetBrick = (brick: availBricks | undefined) => {
    setSelectedUserBrick(brick);
  };

  return (
    <div class={cn("w-[200px] h-full flex-col justify-start items-start gap-6 inline-flex relative")}>
      {isPreview &&
        (
          <div
            className={"absolute inset-0 bg-background opacity-60"}
            onClick={() =>
              toast({
                title: "Warning",
                description:
                  "You can't create or modify bricks in preview mode. Please exit preview mode to manage bricks.",
              })}
          />
        )}
      <div class="w-full flex flex-col gap-2">
        {/* Brick type Dropdown */}
        <Select
          field={bricksTypeField}
          onChange={setCreateBrickType}
          min={1}
          error={null}
          sx={"max-w-full"}
        />

        {/* User-created bricks of the chosen type */}
        {bricksField && (
          <Select
            field={bricksField}
            onChange={(v) => setSelectedUserBrick(userBricks?.find((b) => b.id === Number(v)))}
            min={1}
            error={null}
            sx={"max-w-full"}
          />
        )}
      </div>
      <CreateBrickBar
        brickType={createBrickType}
        brickData={selectedUserBrick}
        setBrick={handleSetBrick} // Pass the callback function as a prop
      />
    </div>
  );
}
