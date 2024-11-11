import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import CreateBrickBar from "@islands/pages/CreateBrickBar.tsx";
import Select, { SelectField } from "@islands/UI/Forms/Select.tsx";
import { availBricks, BricksType, getBrickTypeLabel } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

// Default is the value of the key of BricksType.Single
const defaultBrick = BricksType.Album;

type BrickSideBarSelects = Record<BricksType, availBricks[] | undefined>;

function getKeyByValue<T extends Record<string, unknown>, U extends T[keyof T]>(object: T, value: U): keyof T | undefined {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function BrickSidebar() {
  const [allBricksMap, setAllBricksMap] = useState<BrickSideBarSelects>({
    [BricksType.Album]: undefined,
    [BricksType.HeroSection]: undefined,
    [BricksType.Single]: undefined,
    [BricksType.Text]: undefined,
    [BricksType.Platform_Link]: undefined,
  });

  const [selectedBrickType, setSelectedBrickType] = useState<BricksType>(defaultBrick);
  const [selectedUserBrick, setSelectedUserBrick] = useState<availBricks | undefined>();

  /** UseEffect triggered when you select a type of brick to manage */
  useEffect(() => {
    if (!allBricksMap[selectedBrickType]) {
      fetch(`/api/brick/getUserBricks/${selectedBrickType}`)
        .then((res) => res && res.json())
        .then((data: availBricks[]) => {
          setAllBricksMap((p) => ({ ...p, [selectedBrickType]: data }));
        });
    }
  }, [selectedBrickType]);

  /** Select field, to choose the brick type */
  const brickTypeOptions = useMemo<SelectField>(
    () => ({
      name: "bricktype",
      defaultValue: defaultBrick,
      type: "select",
      options: Object.entries(BricksType).map(([_, value]: [string, BricksType]) => ({
        value,
        label: getBrickTypeLabel(value),
      })),
    }),
    []
  );

  // Custom dependency state trigger value, to re-calculate the userBrickOptions when some of the title changes (so on create/update/delete)
  const ubOptionsTrigger = useMemo(
    () => JSON.stringify((allBricksMap[selectedBrickType] ?? []).map((b) => ({ id: b.id, name: b.name, nodeId: b.nodeId }))),
    [selectedBrickType, allBricksMap]
  );

  /** Select field, to choose the brick to manage */
  const userBrickOptions = useMemo<SelectField>(
    () => ({
      name: "userbricks",
      type: "select",
      defaultValue: "create",
      options: [
        ...(allBricksMap[selectedBrickType]?.map((b) => ({
          value: b.id.toString(),
          label: b.name,
          ...(b.nodeId && {
            onMouseEnter: () => onItemHover("enter", b.nodeId as string),
            onMouseLeave: () => onItemHover("leave", b.nodeId as string),
          }),
        })) ?? []),
        {
          value: "create",
          label: "Créer une nouvelle brique",
        },
      ],
    }),
    [ubOptionsTrigger]
  );

  useEffect(() => {
    setSelectedUserBrick(undefined);
  }, [ubOptionsTrigger]);

  const { MCNodes, isPreview } = useMNodeContext();
  const { toast } = useToast();

  /** When you delete a node in the canva, keep track of it, to correctly update the options in the select */
  const canvaModifTrigger = useMemo(() => JSON.stringify(MCNodes.map((n) => n.id)), [MCNodes, selectedBrickType]);
  useEffect(() => {
    setAllBricksMap((p) => {
      const nodeIds = JSON.parse(canvaModifTrigger ?? "[]") as string[];
      return {
        ...p,
        [selectedBrickType]: (p[selectedBrickType] ?? []).map((b) => {
          if (b.nodeId && !nodeIds.includes(b.nodeId)) {
            return {
              ...b,
              nodeId: undefined,
            };
          }
          return b;
        }),
      };
    });
  }, [canvaModifTrigger]);

  /** Highlight the node in the canvas when hovering over the brick in the sidebar */
  const onItemHover = (action: "enter" | "leave", id: string | number) => {
    const el = document.querySelector("#mcanva-article-placeholder[data-node-id='" + id + "']");
    if (el) {
      if (action === "enter") el.classList.add("node-highlight");
      if (action === "leave") el.classList.remove("node-highlight");
    }
  };

  /** Handle the returned brick by CreateBrickBar
   *
   * @param {number | availBricks} brick - The brick to manage. If it's a number, it's a brick to delete. If it's an availBricks, it's a brick to create/update.
   */
  const handleBrickAction = useCallback(
    (brick: number | availBricks) => {
      if (typeof brick === "number") {
        setAllBricksMap((p) => ({
          ...p,
          [selectedBrickType]: (p[selectedBrickType] ?? []).map((b) => (b.id === brick ? null : b)).filter(Boolean),
        }));
      } else {
        setAllBricksMap((p) => {
          const isIn = p[selectedBrickType]?.find((b) => b.id === brick.id);
          return {
            ...p,
            [selectedBrickType]: isIn ? p[selectedBrickType]?.map((b) => (b.id === brick.id ? brick : b)) : [...(p[selectedBrickType] ?? []), brick],
          };
        });
      }
    },
    [selectedBrickType]
  );

  return (
    <div class={cn("w-[200px] h-full flex-col justify-start items-start gap-6 inline-flex relative")}>
      {isPreview && (
        <div
          className={"absolute inset-0 bg-background opacity-60"}
          onClick={() =>
            toast({
              title: "Warning",
              description: "You can't create or modify bricks in preview mode. Please exit preview mode to manage bricks.",
            })
          }
        />
      )}
      <div class="w-full flex flex-col gap-2">
        {/* Brick type Dropdown */}
        <Select field={brickTypeOptions} onChange={setSelectedBrickType} min={1} error={null} sx={"max-w-full"} />

        {/* User-created bricks of the chosen type */}
        <Select
          field={userBrickOptions}
          onChange={(v) => setSelectedUserBrick(allBricksMap[selectedBrickType]?.find((b) => b.id === Number(v)))}
          min={1}
          error={null}
          sx={"max-w-full"}
        />
      </div>
      <CreateBrickBar brickType={selectedBrickType} brickData={selectedUserBrick} returnBrick={handleBrickAction} />
    </div>
  );
}
