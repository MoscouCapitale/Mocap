import AddMediaZone from "@islands/Misc/AddMediaZone.tsx";
import { useEffect, useState } from "preact/hooks";
import InpagePopup from "@islands/Layout/InpagePopup.tsx";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import AddButton from "@islands/collection/AddButton.tsx";
import { MediaType } from "@models/Medias.ts";
import { Media } from "@models/Medias.ts";
import { HeroSection, Single, Album, Text, Social, PlateformLink, BricksType, createDefaultBrick, BrickModifiableAttributes } from "@models/Bricks.ts";
import { renderMediaInputs } from "@utils/inputs.tsx";
import { DatabaseAttributes } from "@models/App.ts";
import Button from "@islands/Button.tsx";

type CreateBrickBarProps = {
  brickType: BricksType;
  brickData?: any;
};

export default function CreateBrickBar({ brickType, brickData }: CreateBrickBarProps) {
  const [displayMedias, setDisplayMedias] = useState<boolean>(false);
  const [isModifying, setIsModifying] = useState<boolean>(false);
  const [brick, setBrick] = useState<HeroSection | Single | Album | Text | Social | PlateformLink>(brickData);

  useEffect(() => {
    // if (!brick || globalThis.confirm("Etes-vous sûr ? Toute progression non sauvegardée sera perdue.")){
    setBrick(createDefaultBrick(brickType));
  }, [brickType]);

  useEffect(() => {
    if (brickData?.id) {
      brickData.id === -1 ? setBrick(createDefaultBrick(brickType)) : setBrick(brickData)
      setIsModifying(brickData.id !== -1);
    } 
  }, [brickData])

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
        if (brickVal.find((e: any) => e.id === v.id)) newValue = [...brickVal.filter((e: any) => e.id !== v.id)];
        else newValue = [...brickVal.filter((v: any) => v.name), v] || [{}];
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
      }),
    }).finally(() => {
      if (withCanvaInsert) addBrickToCanvas();
    });
  };

  // TODO: to be implemented
  // const deleteBrick = () => {
  //   if (!brick) return;
  //   fetch("/api/brick", {
  //     method: "DELETE",
  //     body: JSON.stringify({
  //       type: brickType,
  //       data: brick,
  //     }),
  //   });
  // };

  const addBrickToCanvas = () => {
    console.log("adding brick to canvas", brick);
  };

  return brick ? (
    <>
      {/* <AddMediaZone handleFileUpload={() => setDisplayMedias(true)} /> */}
      <div className={"flex flex-col w-full gap-4"}>{renderMediaInputs(brick, updateBrick, BrickModifiableAttributes, () => setDisplayMedias(true))}</div>
      <div class="w-full gap-4 flex flex-col justify-center align-middle">
        <Button text={`${isModifying ? 'Modifier et insérer' : 'Générer'}`} onClick={saveBrick} className={{ wrapper: "grow justify-center text-2xl" }} />
        <Button variant="secondary" text={`${isModifying ? 'Modifier' : 'Enregistrer'} la brique`} onClick={() => saveBrick(true)} className={{ wrapper: "grow justify-center" }} />
      </div>
      {displayMedias && (
        <InpagePopup closePopup={() => setDisplayMedias(false)}>
          <div class="w-full overflow-auto min-h-[0] flex-col justify-start items-start gap-10 inline-flex">
            {Object.entries(MediaType)?.map(([key, val]: [string, MediaType]) => (
              <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
                <div class="text-text font-bold">{val}</div>
                <CollectionGrid onMediaClick={mediaClickHandler} fetchingRoute={val as MediaType} mediaSize={150} />
              </div>
            ))}
            <AddButton position="absolute top-3 right-7" />
          </div>
        </InpagePopup>
      )}
    </>
  ) : null;
}
