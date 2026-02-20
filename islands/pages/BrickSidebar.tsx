import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import { availBricks, BricksType, EBrickType, getBrickTypeLabel } from "@models/Bricks.ts";
import { cn } from "@utils/cn.ts";
import ky from "ky";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import Select, { SelectField } from "../UI/Forms/Select.tsx";
import CreateBrickBar from "./CreateBrickBar.tsx";

// Default is the value of the key of BricksType.Single
const defaultBrick = EBrickType.album;

type BrickSideBarSelects = Record<BricksType, availBricks[] | undefined>;

export default function BrickSidebar() {
  const [allBricksMap, setAllBricksMap] = useState<BrickSideBarSelects>({
    [BricksType.Album]: undefined,
    [BricksType.HeroSection]: undefined,
    [BricksType.Single]: undefined,
    [BricksType.Text]: undefined,
    [BricksType.Platform_Link]: undefined,
    [BricksType.Highlight]: undefined,
    [BricksType.Audio]: undefined,
  });

  const [selectedBrickType, setSelectedBrickType] = useState(defaultBrick);
  const [selectedUserBrick, setSelectedUserBrick] = useState<availBricks | undefined>();

  /** UseEffect triggered when you select a type of brick to manage */
  useEffect(() => {
    // if (!allBricksMap[selectedBrickType]) {
    //   ky.get(`/api/brick/getUserBricks/${selectedBrickType}`)
    //     .json<availBricks[]>()
    //     .then((data) => {
    //       setAllBricksMap((p) => ({ ...p, [selectedBrickType]: data }));
    //     });
    // }
  }, [selectedBrickType]);

  /** Select field, to choose the brick type */
  const brickTypeOptions = useMemo<SelectField>(
    () => ({
      name: "bricktype",
      defaultValue: defaultBrick,
      type: "select",
      options: Object.entries(EBrickType).map(([value, label]) => ({
        value,
        label,
      })),
    }),
    [],
  );

  // Custom dependency state trigger value, to re-calculate the userBrickOptions when some of the title changes (so on create/update/delete)
  const ubOptionsTrigger = useMemo(
    () =>
      JSON.stringify(
        (allBricksMap[selectedBrickType] ?? []).map((b) => ({ id: b.id, name: b.name, nodeId: b.nodeId })),
      ),
    [selectedBrickType, allBricksMap],
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
            [selectedBrickType]: isIn
              ? p[selectedBrickType]?.map((b) => (b.id === brick.id ? brick : b))
              : [...(p[selectedBrickType] ?? []), brick],
          };
        });
      }
    },
    [selectedBrickType],
  );

  return (
    <div class={cn("w-[calc(200px+1rem)] h-full flex-col justify-start items-start gap-6 inline-flex relative")}>
      {isPreview && (
        <div
          className="absolute inset-0 bg-background opacity-60"
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
        <Select field={brickTypeOptions} onChange={setSelectedBrickType} min={1} error={null} sx="max-w-full" />

        <button type="button">
          Create new
        </button>
      </div>
      <CreateBrickBar brickType={selectedBrickType} brickData={selectedUserBrick} returnBrick={handleBrickAction} />
    </div>
  );
}
