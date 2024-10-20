import Button from "@islands/Button.tsx";
import FileInput from "@islands/UI/Forms/FileInput/index.tsx";
import { IconTrash } from "@utils/icons.ts";
import { useState } from "preact/hooks";

export default function UploadMediaPopup() {
  const [updating, setUpdating] = useState<boolean>(false);

  const [mediaToUpload, setMediaToUpload] = useState<File | null>(null);

  const uploadFileToCollection = () => {
    setUpdating(true);
    if (mediaToUpload) {
      const formData = new FormData();
      formData.append("file", mediaToUpload);
      fetch(`/api/medias`, { method: "POST", body: formData }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    setUpdating(false);
  };

  return (
    <div
      className={"max-w-4xl flex flex-col items-center gap-4"}
    >
      <FileInput handleFileChange={(f) => setMediaToUpload(f)} />
      {mediaToUpload && (
        <div class="text-text flex justify-center align-center gap-4 w-full">
          <Button
            text={`${updating ? "..." : "Téléverser"}`}
            onClick={uploadFileToCollection}
            className={{ wrapper: "min-w-[150px] justify-center" }}
          />
          <IconTrash
            className={"text-error cursor-pointers"}
            onClick={() => setMediaToUpload(null)}
          />
        </div>
      )}
    </div>
  );
}
