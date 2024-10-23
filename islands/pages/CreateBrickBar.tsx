import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import Button from "@islands/Button.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import AddButton from "@islands/collection/AddButton.tsx";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import { DatabaseAttributes } from "@models/App.ts";
import { availBricks, BrickModifiableAttributes, BricksType, createDefaultBrick } from "@models/Bricks.ts";
import { Media, MediaType } from "@models/Medias.ts";
import { renderMediaInputs } from "@utils/inputs.tsx";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { toast } from "@hooks/toast.tsx";
import { IconTrash } from "@utils/icons.ts";
import ObjectRenderer from "@islands/UI/Forms/ObjectRenderer.tsx";
import { MNode } from "@models/Canva.ts";

type CreateBrickBarProps = {
  brickType: BricksType; // The general type of the brick to create
  brickData?: availBricks;
  setBrick: (brick: availBricks | undefined) => void; // Callback function to pass data to the parent
};

type brickState = "creating" | "modifying" | "alreadyInCanvas";

export default function CreateBrickBar(
  { brickType, brickData, setBrick: bubbleUpBrick }: CreateBrickBarProps,
) {
  const { MCNodes, saveNode, deleteNode } = useMNodeContext();

  const [displayMedias, setDisplayMedias] = useState<boolean>(false);
  const [brickState, setBrickState] = useState<brickState>("creating");
  const [brick, setBrick] = useState<availBricks | undefined>();

  // useEffect(() => {
  //   // if (!brick || globalThis.confirm("Etes-vous sûr ? Toute progression non sauvegardée sera perdue.")){
  //   setBrick(createDefaultBrick(brickType));
  // }, [brickType]);

  useEffect(() => {
    setBrick(brickData);
  }, [brickData]);

  useEffect(() => {
    if (brickData) {
      if (MCNodes.find((n) => n.id === brickData.nodeId)) setBrickState("alreadyInCanvas");
      else setBrickState("modifying");
    } else {
      setBrickState("creating");
    }
  }, [MCNodes, brickData]);

  const mediaClickHandler = (media: Media) => {
    if (!brick) return;
    // @ts-expect-error - I know that the media is not null
    setBrick((prev) => ({ ...prev, media }));
    setDisplayMedias(false);
  };

  const saveBrick = useCallback((withCanvaInsert?: boolean) => {
    if (!brick) return;
    fetch("/api/brick", {
      method: "PUT",
      body: JSON.stringify({
        type: brickType,
        data: brick,
        withCanvaInsert: Boolean(withCanvaInsert),
      }),
    }).then(async (res) => {
      if (res.ok && res.status !== 204) return await res.json();
    }).then((res) => {
      if (res) {
        const result: { newNode: MNode } = res;
        toast({
          title: "Brick saved",
          description: `The brick ${brick.name} has been saved.`,
        });
        if (withCanvaInsert && result.newNode) saveNode(result.newNode, true);
        bubbleUpBrick(undefined);
      }
    });
  }, [brick]);

  const deleteBrick = useCallback(async () => {
    if (
      brickData && brick &&
      globalThis.confirm(
        `Are you sure ? The will NOT be recoverable.${
          brickData.nodeId ? " The brick will also be removed from the canvas." : ""
        }`,
      )
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
        bubbleUpBrick(undefined);
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
      case "alreadyInCanvas":
        return "Modifier et remplacer";
      case "modifying":
        return "Modifier et insérer";
      case "creating":
        return "Générer";
    }
  };

  // TODO: implement node and brick deletion, and check node insert from brick in brick collection page

  return (
    <>
      <div className={"flex flex-col w-full gap-4"}>
        <ObjectRenderer
          type={brickType}
          content={brickData}
          onChange={(v) => setBrick(v as availBricks)}
        />
      </div>
      <div class="w-full gap-4 flex flex-col justify-center align-middle">
        <Button
          onClick={() => saveBrick(true)}
          className={{ wrapper: "grow justify-center text-2xl" }}
        >{mainButtonText()}</Button>
        <Button
          variant="secondary"
          onClick={() => saveBrick()}
          className={{ wrapper: "grow justify-center" }}
        >{brickState === "modifying" ? "Modifier" : "Enregistrer"} la brique</Button>
        {brickData && (
          <Button
            variant="danger"
            onClick={deleteBrick}
            className={{ wrapper: "grow justify-center" }}
            icon={<IconTrash size={20} color="#EA5959" />}
          >Supprimer la brique</Button>
        )}
      </div>
      <InpagePopup
        isOpen={displayMedias}
        closePopup={() => setDisplayMedias(false)}
      >
        <div class="w-full overflow-auto min-h-[0] flex-col justify-start items-start gap-10 inline-flex">
          {Object.entries(MediaType)?.map((
            [key, val]: [string, MediaType],
          ) => (
            <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
              <div class="text-text font-bold">{val}</div>
              <CollectionGrid
                onMediaClick={mediaClickHandler}
                fetchingRoute={val as MediaType}
                mediaSize={150}
              />
            </div>
          ))}
          {/* TODO: add support to upload media here. For now nested modals are working properly */}
          <AddButton position="absolute top-3 right-7" />
        </div>
      </InpagePopup>
      {/* <Toaster /> */}
    </>
  );
}
