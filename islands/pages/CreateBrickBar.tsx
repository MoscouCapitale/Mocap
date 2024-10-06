import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import Button from "@islands/Button.tsx";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import AddButton from "@islands/collection/AddButton.tsx";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import { DatabaseAttributes } from "@models/App.ts";
import {
  availBricks,
  BrickModifiableAttributes,
  BricksType,
  createDefaultBrick,
} from "@models/Bricks.ts";
import { Media, MediaType } from "@models/Medias.ts";
import { renderMediaInputs } from "@utils/inputs.tsx";
import { useEffect, useState } from "preact/hooks";
import { toast } from "@hooks/toast.tsx";
import { IconTrash } from "@utils/icons.ts";

type CreateBrickBarProps = {
  brickType: BricksType; // The general type of the brick to create
  brickData?: availBricks;
};

type brickState = "creating" | "modifying" | "alreadyInCanvas";

export default function CreateBrickBar(
  { brickType, brickData }: CreateBrickBarProps,
) {
  const { MCNodes, saveNode, deleteNode } = useMNodeContext();

  const [displayMedias, setDisplayMedias] = useState<boolean>(false);
  const [brickState, setBrickState] = useState<brickState>("creating");
  const [brick, setBrick] = useState<availBricks | null>();

  useEffect(() => {
    // if (!brick || globalThis.confirm("Etes-vous sûr ? Toute progression non sauvegardée sera perdue.")){
    setBrick(createDefaultBrick(brickType));
  }, [brickType]);

  useEffect(() => {
    if (brickData) {
      setBrick(brickData);
    } else {
      setBrick(createDefaultBrick(brickType));
    }
  }, [brickData]);

  useEffect(() => {
    if (brickData) {
      if (MCNodes.find((n) => n.id === brickData.nodeId)) {
        setBrickState("alreadyInCanvas");
      } else {
        setBrickState("modifying");
      }
    } else {
      setBrickState("creating");
    }
  }, [MCNodes, brickData]);

  const mediaClickHandler = (media: Media) => {
    if (!brick) return;
    setBrick((prev: any) => {
      return { ...prev, media };
    });
    setDisplayMedias(false);
  };

  const updateBrick = (k: any, v: any) => {
    if (!brick) return;
    setBrick((prev: any) => {
      const brickVal = (prev as any)[k];
      let newValue = v;
      if (DatabaseAttributes[k]?.multiple) {
        if (brickVal.find((e: any) => e.id === v.id)) {
          newValue = [...brickVal.filter((e: any) => e.id !== v.id)];
        } else newValue = [...brickVal.filter((v: any) => v.name), v] || [{}];
      }
      return { ...prev, [k]: newValue };
    });
  };

  const saveBrick = (withCanvaInsert?: boolean) => {
    if (!brick) return;
    fetch("/api/brick", {
      method: "PUT",
      body: JSON.stringify({
        type: brickType,
        data: brick,
        withCanvaInsert: Boolean(withCanvaInsert),
      }),
    }).then((res) => {
      if (res.ok && res.status !== 204) res.json();
    }).then((res) => {
      toast({
        title: "Brick saved",
        description: `The brick ${brick.name} has been saved.`,
      });
      if (withCanvaInsert && res?.newNode) saveNode(res.newNode, true);
    });
  };

  const deleteBrick = async () => {
    if (
      brickData && brick &&
      globalThis.confirm(
        `Are you sure ? The will NOT be recoverable.${
          brickData.nodeId
            ? " The brick will also be removed from the canvas."
            : ""
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
        setBrick(createDefaultBrick(brickType));
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description:
            `An error occured while deleting the brick. Please try again later.`,
        });
      }
    }
  };

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

  return brick
    ? (
      <>
        <div className={"flex flex-col w-full gap-4"}>
          {renderMediaInputs(
            brick,
            updateBrick,
            BrickModifiableAttributes,
            () => setDisplayMedias(true),
          )}
        </div>
        <div class="w-full gap-4 flex flex-col justify-center align-middle">
          <Button
            text={mainButtonText()}
            onClick={() => saveBrick(true)}
            className={{ wrapper: "grow justify-center text-2xl" }}
          />
          <Button
            variant="secondary"
            text={`${
              brickState === "modifying" ? "Modifier" : "Enregistrer"
            } la brique`}
            onClick={saveBrick}
            className={{ wrapper: "grow justify-center" }}
          />
          {brickData && (
            <Button
              variant="danger"
              text={`Supprimer la brique`}
              onClick={deleteBrick}
              className={{ wrapper: "grow justify-center" }}
              icon={<IconTrash size={20} color="#EA5959" />}
            />
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
    )
    : null;
}
