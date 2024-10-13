import {
  Media,
  MediaByType,
  MediaModifiableAttributes,
  MediaType,
} from "@models/Medias.ts";
import {
  convertAcceptFileTypeMapToInputAccept,
  createDefaultMediaFromRawFile,
} from "@utils/database.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import Button from "@islands/Button.tsx";
import { Audio, Image, Misc, Video } from "@models/Medias.ts";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import IconX from "@tabler-icons-url/x.tsx";
import { renderMediaInputs } from "@utils/inputs.tsx";
import AddMediaZone from "@islands/Misc/AddMediaZone.tsx";

type MediaUploadType = 
  | (Image & { rawFile: File })
  | (Video & { rawFile: File })
  | (Audio & { rawFile: File })
  | (Misc & { rawFile: File });

export default function UploadMediaPopup() {

  // TODO: set all of this in a form, and use new form inputs

  const [updating, setUpdating] = useState<boolean>(false);

  const [mediaToUpload, setMediaToUpload] = useState<MediaUploadType | null>(
    null,
  );

  const handleFileUpload = (e: any) => {
    const rawFile = e.target.files[0]
    setMediaToUpload(
      {
        ...createDefaultMediaFromRawFile(rawFile) as MediaUploadType,
        rawFile
      }
    );
  };

  const uploadFileToCollection = () => {
    setUpdating(true);
    console.log("Uploading the media: ", mediaToUpload)
    if (mediaToUpload?.rawFile) {
      const formData = new FormData();
      formData.append("file", mediaToUpload?.rawFile);
      fetch(`/api/medias`, { method: "POST", body: formData }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    setUpdating(false);
  };

  const updateItemDetail = (k: any, v: any) => {
    if (!mediaToUpload) return;
    setMediaToUpload((prev: any) => {
      const prevVal = (prev as any)[k];
      let newValue = v;
      if (MediaModifiableAttributes[k]?.multiple) {
        if (prevVal.find((e: any) => e.id === v.id)) newValue = [...prevVal.filter((e: any) => e.id !== v.id)];
        else newValue = [...prevVal.filter((v: any) => v.name), v] || [{}];
      }
      return { ...prev, [k]: newValue };
    });
  };

  return !mediaToUpload
    ? (
      <AddMediaZone
        isInput
        handleFileUpload={handleFileUpload}
        accept={convertAcceptFileTypeMapToInputAccept()}
      />
    )
    : (
      <div class="flex gap-8">
        <div className="max-w-4xl relative">
          <MediaPreview media={mediaToUpload} from={"detail"} />
          <div
            className="absolute items-start gap-[3px] inline-flex bg-background top-0 right-0 p-2 rounded-bl-[50%]"
            onClick={() => setMediaToUpload(null)}
          >
            <IconX className="text-error cursor-pointer" />
          </div>
        </div>
        <div class="w-1/2 flex flex-col gap-5">
          {renderMediaInputs(
            mediaToUpload,
            updateItemDetail,
            MediaModifiableAttributes,
          )}
          <div class="text-text flex align-center gap-4">
            <Button
              text={`${updating ? "..." : "Téléverser"}`}
              onClick={uploadFileToCollection}
              className={{ wrapper: "grow justify-center" }}
            />
          </div>
        </div>
      </div>
    );
}
