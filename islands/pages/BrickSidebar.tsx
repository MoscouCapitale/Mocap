import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { useToast } from "@hooks/toast.tsx";
import { EBrickType, getBrickTypeLabel, IBrick } from "@models/Bricks.ts";
import { SelectField } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import ky from "ky";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import CreateBrickBar from "./CreateBrickBar.tsx";
import { Select } from "@islands/UI";
import { IconPlus } from "@utils/icons.ts";

// Default is the value of the key of BricksType.Single
const defaultBrick = EBrickType.Album;

const BrickTypeSelectField: SelectField<false> = {
  name: "bricktype",
  type: "select",
  defaultValue: { value: EBrickType.Album, label: getBrickTypeLabel(EBrickType.Album) },
  options: async () =>
    await Object.entries(EBrickType).map(([label, value]) => ({
      value,
      label,
    })),
};

type BrickSideBarSelects = Record<EBrickType, IBrick[] | undefined>;

export default function BrickSidebar() {
  const [selectedBrickType, setSelectedBrickType] = useState(defaultBrick);
  const [selectedUserBrick, setSelectedUserBrick] = useState<IBrick>();

  /** Select field, to choose the brick to manage */
  const userBrickOptions = useMemo<SelectField<false>>(
    () => ({
      name: "userbricks",
      type: "select",
      options: async () => {
        const data = await ky.get(`/api/brick/getUserBricks/${selectedBrickType}`).json<IBrick<typeof selectedBrickType>[]>();

        return [
          ...(data ?? []).map((b) => ({
            value: b,
            label: b.name ?? b.title,
            ...(b.nodeId && {
              onMouseEnter: () => onItemHover("enter", b.nodeId as string),
              onMouseLeave: () => onItemHover("leave", b.nodeId as string),
            }),
          })),
          {
            value: {},
            label: (
              <div className="flex gap-4 justify-between items-center w-full">
                <p>Ajouter un élément</p>
                <IconPlus className="text-text" size={20} />
              </div>
            ),
            onSelect: (e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedUserBrick(undefined);
              return null;
            },
          },
        ];
      },
    }),
    [selectedBrickType],
  );

  /** Highlight the node in the canvas when hovering over the brick in the sidebar */
  const onItemHover = (action: "enter" | "leave", id: string | number) => {
    const el = document.querySelector("#mcanva-article-placeholder[data-node-id='" + id + "']");
    if (el) {
      if (action === "enter") el.classList.add("node-highlight");
      if (action === "leave") el.classList.remove("node-highlight");
    }
  };

  const { MCNodes, isPreview } = useMNodeContext();
  const { toast } = useToast();

  // /** When you delete a node in the canva, keep track of it, to correctly update the options in the select */
  // const canvaModifTrigger = useMemo(() => JSON.stringify(MCNodes.map((n) => n.id)), [MCNodes, selectedBrickType]);
  // useEffect(() => {
  //   setAllBricksMap((p) => {
  //     const nodeIds = JSON.parse(canvaModifTrigger ?? "[]") as string[];
  //     return {
  //       ...p,
  //       [selectedBrickType]: (p[selectedBrickType] ?? []).map((b) => {
  //         if (b.nodeId && !nodeIds.includes(b.nodeId)) {
  //           return {
  //             ...b,
  //             nodeId: undefined,
  //           };
  //         }
  //         return b;
  //       }),
  //     };
  //   });
  // }, [canvaModifTrigger]);

  /** Handle the returned brick by CreateBrickBar
   *
   * @param {number | IBrick} brick - The brick to manage. If it's a number, it's a brick to delete. If it's an availBricks, it's a brick to create/update.
   */
  const handleBrickAction = useCallback(
    (brick: string | IBrick) => {
      userBrickOptions.updateOptions!().then(() => userBrickOptions.selectOptions!(typeof brick === "string" ? undefined : { value: brick, label: "" }));
      // if (typeof brick === "string") {
      //   setAllBricksMap((p) => ({
      //     ...p,
      //     [selectedBrickType]: (p[selectedBrickType] ?? []).map((b) => (b.id === brick ? null : b)).filter(Boolean),
      //   }));
      // } else {
      //   setAllBricksMap((p) => {
      //     const isIn = p[selectedBrickType]?.find((b) => b.id === brick.id);
      //     return {
      //       ...p,
      //       [selectedBrickType]: isIn ? p[selectedBrickType]?.map((b) => (b.id === brick.id ? brick : b)) : [...(p[selectedBrickType] ?? []), brick],
      //     };
      //   });
      // }
    },
    [selectedBrickType],
  );

  return (
    <div class={cn("w-54 h-full flex-col justify-start items-start gap-6 inline-flex relative")}>
      {isPreview && (
        <div
          className="absolute inset-0 bg-background opacity-60"
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
        <Select field={BrickTypeSelectField} onChange={(v) => setSelectedBrickType(v?.value as EBrickType)} />

        {/* User-created bricks of the chosen type */}
        <Select field={userBrickOptions} onChange={(v) => setSelectedUserBrick(v?.value as IBrick)} />
      </div>
      <CreateBrickBar brickType={selectedBrickType} brickData={selectedUserBrick} returnBrick={handleBrickAction} />
    </div>
  );
}
