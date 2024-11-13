import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { toast } from "@hooks/toast.tsx";
import Button from "@islands/Button.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import ObjectRenderer from "@islands/UI/Forms/ObjectRenderer.tsx";
import AddButton from "@islands/collection/AddButton.tsx";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import { availBricks, BricksType } from "@models/Bricks.ts";
import { MNode } from "@models/Canva.ts";
import { Media, MediaType } from "@models/Medias.ts";
import { IconTrash } from "@utils/icons.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import { isEqual } from "lodash";

type CreateBrickBarProps = {
  brickType: BricksType; // The general type of the brick to create
  brickData?: availBricks;
  returnBrick: (brick: number | availBricks) => void; // Callback function to pass data to the parent
};

type brickState = "creating" | "modifying" | "modifyingIncanvas" | "addIncanvas";

export default function CreateBrickBar({ brickType, brickData, returnBrick }: CreateBrickBarProps) {
  const { MCNodes, saveNode, deleteNode } = useMNodeContext();

  const [displayMedias, setDisplayMedias] = useState<boolean>(false);
  const [brickState, setBrickState] = useState<brickState>();
  const [brick, setBrick] = useState<availBricks | undefined>();

  useEffect(() => {
    setBrick(brickData);
    setBrickState(undefined);
  }, [brickData]);

  useEffect(() => {
    if (!brickState && !isEqual(brickData, brick)) {
      if (brickData) {
        if (MCNodes.find((n) => n.id === brickData.nodeId)) setBrickState("modifyingIncanvas");
        else setBrickState("modifying");
      } else {
        setBrickState("creating");
      }
    } else if (!brickState && brickData && !brickData?.nodeId) {
      setBrickState("addIncanvas");
    }
  }, [brick]);

  const mediaClickHandler = (media: Media) => {
    if (!brick) return;
    // @ts-expect-error - I know that the media is not null
    setBrick((prev) => ({ ...prev, media }));
    setDisplayMedias(false);
  };

  const saveBrick = useCallback(
    (withCanvaInsert?: boolean) => {
      if (!brick) return;
      fetch("/api/brick", {
        method: "PUT",
        body: JSON.stringify({
          type: brickType,
          data: brick,
          withCanvaInsert: Boolean(withCanvaInsert),
        }),
      })
        .then(async (res) => {
          if (res.ok && res.status !== 204) return await res.json();
        })
        .then((res) => {
          if (res) {
            const { newNode, ...result }: availBricks & { newNode?: MNode } = res;
            toast({
              title: "Brick saved",
              description: `The brick ${brick.name} has been saved.`,
            });
            if (withCanvaInsert && newNode) saveNode({ node: newNode, rerender: true });
            returnBrick({ ...result, nodeId: newNode?.id ?? result.nodeId });
          }
        });
    },
    [brick]
  );

  const deleteBrick = useCallback(async () => {
    if (
      brickData &&
      brick &&
      globalThis.confirm(`Are you sure ? The will NOT be recoverable.${brickData.nodeId ? " The brick will also be removed from the canvas." : ""}`)
    ) {
      try {
        await fetch(`/api/brick`, {
          method: "DELETE",
          body: JSON.stringify({
            data: brick,
            type: brickType,
          }),
        });
        if (brickData?.nodeId) await deleteNode(brickData.nodeId);
        toast({
          title: "Brick deleted",
          description: `The brick has been deleted.`,
        });
        returnBrick(brick.id);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: `An error occured while deleting the brick. Please try again later.`,
        });
      }
    }
  }, [brick]);

  const mainButtonText = () => {
    switch (brickState) {
      case "modifyingIncanvas":
        return "Modifier et remplacer";
      case "modifying":
        return "Modifier et insérer";
      case "creating":
        return "Générer";
      case "addIncanvas":
        return "Insérer";
      default:
        return "";
    }
  };

  // TODO: implement node and brick deletion, and check node insert from brick in brick collection page

  return (
    <>
      <div className={"flex flex-col w-full gap-4"}>
        <ObjectRenderer type={brickType} content={brickData} onChange={(v) => setBrick(v as availBricks)} />
      </div>
      <div class="w-full gap-4 flex flex-col justify-center align-middle">
        {brickState && (
          <Button onClick={() => saveBrick(true)} className={{ wrapper: "grow justify-center text-2xl" }}>
            {mainButtonText()}
          </Button>
        )}
        {brickState && brickState !== "modifyingIncanvas" && (
          <Button variant="secondary" onClick={() => saveBrick()} className={{ wrapper: "grow justify-center" }}>
            {brickState === "modifying" ? "Modifier" : "Enregistrer"} la brique
          </Button>
        )}
        {brickData && (
          <Button variant="danger" onClick={deleteBrick} className={{ wrapper: "grow justify-center" }} icon={<IconTrash size={20} color="#EA5959" />}>
            Supprimer la brique
          </Button>
        )}
      </div>
      <InpagePopup isOpen={displayMedias} closePopup={() => setDisplayMedias(false)}>
        <div class="w-full overflow-auto min-h-[0] flex-col justify-start items-start gap-10 inline-flex">
          {Object.entries(MediaType)?.map(([key, val]: [string, MediaType]) => (
            <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
              <div class="text-text font-bold">{val}</div>
              <CollectionGrid onMediaClick={mediaClickHandler} fetchingRoute={val as MediaType} mediaSize={150} />
            </div>
          ))}
        </div>
      </InpagePopup>
      {/* <Toaster /> */}
    </>
  );
}
