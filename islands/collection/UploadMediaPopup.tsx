import { useToast } from "@hooks/toast.tsx";
import { FileInput } from "@islands/UI";
import { IconTrash } from "@utils/icons.ts";
import ky from "ky";
import { useEffect, useState } from "preact/hooks";
import Button from "../UI/Button.tsx";

export default function UploadMediaPopup() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<boolean>(false);

  const [mediaToUpload, setMediaToUpload] = useState<File | null>(null);
  const [disabledUpload, setDisabledUpload] = useState<boolean>(false);

  useEffect(() => {
    setDisabledUpload(false);
    const settings = localStorage.getItem("media_settings");
    if (settings && mediaToUpload) {
      const { media_max_size_mb, media_max_size_height } = JSON.parse(settings);
      if (media_max_size_mb && mediaToUpload.size > media_max_size_mb * 1024 * 1024) {
        toast({
          title: "Erreur lors du téléversement",
          description: `La taille du fichier est trop grande, la taille maximale est de ${media_max_size_mb} Mo.`,
        });
        setDisabledUpload(true);
      }
      if (media_max_size_height && mediaToUpload.type.includes("image") && media_max_size_height) {
        const img = new Image();
        img.src = URL.createObjectURL(mediaToUpload);
        img.onload = () => {
          if (img.height > media_max_size_height) {
            toast({
              title: "Erreur lors du téléversement",
              description: `La hauteur de l'image est trop grande, la hauteur maximale est de ${media_max_size_height} pixels.`,
            });
            setDisabledUpload(true);
          }
        };
      }
    }
  }, [mediaToUpload]);

  const uploadFileToCollection = () => {
    setUpdating(true);
    if (mediaToUpload) {
      const formData = new FormData();
      formData.append("file", mediaToUpload);
      ky.post(`/api/medias`, { body: formData }).then(() => {
        setTimeout(() => {
          globalThis.location.reload();
        }, 1000);
      });
    }
    setUpdating(false);
  };

  return (
    <div className={"max-w-4xl flex flex-col items-center gap-4"}>
      <FileInput handleFileChange={(f) => setMediaToUpload(f)} />
      {mediaToUpload && (
        <div class="text-text flex justify-center align-center gap-4 w-full">
          <Button onClick={uploadFileToCollection} className={{ wrapper: "min-w-[150px] justify-center" }} disabled={disabledUpload || updating}>
            {updating ? "Téléversement..." : "Téléverser"}
          </Button>
          <IconTrash className={"text-error cursor-pointers"} onClick={() => setMediaToUpload(null)} />
        </div>
      )}
    </div>
  );
}
