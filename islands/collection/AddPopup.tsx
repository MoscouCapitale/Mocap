import { Media, MediaByType, MediaModifiableAttributes, MediaType } from "@models/Medias.ts";
import { convertAcceptFileTypeMapToInputAccept, createDefaultMediaFromRawFile } from "@utils/database.ts";
import { useEffect, useState } from "preact/hooks";
import Button from "@islands/Button.tsx";
import { Image, Video, Audio, Misc } from "@models/Medias.ts";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import IconX from "@tabler-icons-url/x.tsx";
import { renderMediaInputs } from "@utils/inputs.tsx";

export default function AddPopup() {
  const [reactiveMedia, setReactiveMedia] = useState<Image | Video | Audio | Misc>();
  const [updating, setUpdating] = useState<boolean>(false);
  const [rawFile, setRawFile] = useState<File>();
  const accept = convertAcceptFileTypeMapToInputAccept();

  const handleFileUpload = (e: any) => {
    setRawFile(e.target.files[0]);
  };

  const uploadFileToCollection = () => {
    setUpdating(true);
    if (rawFile) {
      const formData = new FormData();
      formData.append("file", rawFile);
      fetch(`/api/medias`, { method: "POST", body: formData }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    setUpdating(false);
  };

  useEffect(() => {
    if (rawFile) {
      setReactiveMedia(createDefaultMediaFromRawFile(rawFile) as MediaByType<MediaType>);
      setRawFile(undefined);
    }
  }, [rawFile]);

  return (
    <div class="flex gap-8">
      {!reactiveMedia && (
        <div className="relative overflow-hidden">
          <input
            className="opacity-0 cursor-pointer absolute left-0 w-full top-0 bottom-0 z-10"
            type="file"
            accept={accept}
            onChange={handleFileUpload}
          ></input>
          <div class="w-[200px] h-[200px] rounded-lg border border-text_grey justify-center items-center gap-2.5 inline-flex z-0">
            <div class="absolute break-all w-[238px] text-text text-opacity-10 text-[127px] z-0 leading-[110px]">media</div>
            <div class="text-center text-text text-2xl">+</div>
          </div>
        </div>
      )}
      {reactiveMedia && (
        <>
          <div className="max-w-4xl relative">
            <MediaPreview media={reactiveMedia} from={"detail"} />
            <div className="absolute items-start gap-[3px] inline-flex bg-background top-0 right-0 p-2 rounded-bl-[50%]" onClick={() => setReactiveMedia(undefined)}>
              <IconX className="text-error cursor-pointer" />
            </div>
          </div>
          <div class="w-1/2 flex flex-col gap-5">
            {renderMediaInputs(reactiveMedia, (k, v) => setReactiveMedia({ ...reactiveMedia, [k]: v }), MediaModifiableAttributes)}
            <div class="text-text flex align-center gap-4">
              <Button text={`${updating ? "..." : "Téléverser"}`} onClick={uploadFileToCollection} className={{ wrapper: "grow justify-center" }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
