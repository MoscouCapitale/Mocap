import { useMNodeContext } from "@contexts/MNodeContext.tsx";
import { toast } from "@hooks/toast.tsx";
import { Button, ObjectRenderer, useModal } from "@islands/UI";
import { availBricks, BricksType, EBrickType, IBrick } from "@models/Bricks.ts";
import { MNode } from "@models/Canva.ts";
import { Media, MediaType } from "@models/Medias.ts";
import { IconTrash } from "@utils/icons.ts";
import ky, { HTTPError } from "ky";
import { isEqual } from "lodash";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import CollectionGrid from "../collection/CollectionGrid.tsx";

type CreateBrickBarProps = {
  brickType: EBrickType; // The general type of the brick to create
  brickData?: IBrick;
  returnBrick: (brick: string | IBrick) => void; // Callback function to pass data to the parent
};

type brickState = "creating" | "modifying" | "modifyingIncanvas" | "addIncanvas";

export default function CreateBrickBar({ brickType, brickData, returnBrick }: CreateBrickBarProps) {
  const { MCNodes, saveNode, deleteNode } = useMNodeContext();

  const { isOpen: displayMedias, setIsOpen: setDisplayMedias, Modal } = useModal();
  const [brickState, setBrickState] = useState<brickState>();
  const [brick, setBrick] = useState<IBrick | undefined>();
  const validateForm = useRef<() => boolean>(() => true);

  useEffect(() => {
    setBrick(brickData);
    setBrickState(undefined);
  }, [brickData?.id]);

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

      if (!validateForm.current()) {
        toast({
          title: "Error",
          description: "Le formulaire n'est pas valide. Veuillez vérifier les champs et réessayer.",
        });
        return;
      }

      const brickDatas = { ...brick, type: brickType };
      // if (
      //   withCanvaInsert && brickState === "addIncanvas" && MCNodes.find((n) => n.type === BricksType.HeroSection) &&
      //   brickDatas.type === BricksType.HeroSection
      // ) {
      //   toast({
      //     title: "Error lors de la sauvegarde",
      //     description:
      //       `Vous ne pouvez avoir qu'une seule "Hero Section" par page. Cette brique ne peut pas être insérée au canva.`,
      //   });
      //   return;
      // }
      ky.put("/api/brick", {
        json: {
          data: brickDatas,
          withCanvaInsert: Boolean(withCanvaInsert),
        },
      })
        .json<IBrick & { newNode?: MNode }>()
        .then((res) => {
          if (res) {
            const { newNode, ...result } = res;
            toast({
              title: "Brick saved",
              description: `The brick ${brickDatas.title} has been saved.`,
            });
            if (withCanvaInsert && newNode) saveNode({ node: newNode, rerender: true });
            returnBrick({ ...result, nodeId: newNode?.id ?? result.nodeId });
          }
        })
        .catch((e: HTTPError) => {
          if (e.response?.status === 409) {
            toast({
              title: "Error lors de la sauvegarde",
              description: `Une brique avec le même nom existe déjà. Veuillez changer le nom de la brique.`,
            });
          } else {
            console.error(e);
            toast({
              title: "Error",
              description: `Une erreur est survenue lors de la sauvegarde de la brique. Veuillez réessayer plus tard.`,
            });
          }
        });
    },
    [brick],
  );

  const deleteBrick = useCallback(async () => {
    if (
      brickData &&
      brick &&
      globalThis.confirm(`Are you sure ? The will NOT be recoverable.${brickData.nodeId ? " The brick will also be removed from the canvas." : ""}`)
    ) {
      try {
        await ky.delete("/api/brick", {
          json: {
            data: brick,
          },
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
      <div className="flex flex-col w-full gap-4 min-h-0 overflow-scroll">
        <ObjectRenderer
          type={brickType}
          content={brick}
          onChange={(v) => setBrick(v as IBrick)}
          validateForm={validateForm.current}
        />
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
      {/* TODO: support medias */}
      {/* <Toaster /> */}
    </>
  );
}
