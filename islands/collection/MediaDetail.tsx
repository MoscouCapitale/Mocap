import { Media, Image, Video, Audio, Misc, MediaType, MediaByType, DatabaseMedia } from "@models/Medias.ts";
import { useEffect, useState } from "preact/hooks";
import { IconTrash } from "@utils/icons.ts";
import Button from "@islands/Button.tsx";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import { filterOutNonValideAttributes } from "@utils/database.ts";
import { ConfirmationModalProps } from "@models/App.ts";
import ConfirmationModal from "@islands/ConfirmationModal.tsx";
import { renderMediaInputs } from "@utils/inputs.tsx";
import { MediaModifiableAttributes } from "@models/Medias.ts";

interface MediaDetailProps {
  media: Image | Video | Audio | Misc;
}

export default function MediaDetail({ media }: MediaDetailProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState<ConfirmationModalProps | null>(null);
  const [reactiveMedia, setReactiveMedia] = useState<Image | Video | Audio | Misc>(media);
  const [updating, setUpdating] = useState<boolean>(false);

  // log reactiveMedia in useEffect
  useEffect(() => {
    console.log(reactiveMedia);
  }, [reactiveMedia]);

  const updateMedia = () => {
    setUpdating(true);
    if (reactiveMedia.id) {
      fetch(`/api/medias/${reactiveMedia.id}`, { method: "PUT", body: JSON.stringify(reactiveMedia) })
        .then((res) => res.json())
        .then((data: DatabaseMedia[]) => {
          data[0] && setReactiveMedia(filterOutNonValideAttributes(data[0]) as MediaByType<MediaType>);
        });
    }
    setUpdating(false);
  };

  const deleteMedia = () => {
    setShowConfirmationModal({
      message: "Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible.",
      onConfirm: () => {
        reactiveMedia.id && fetch(`/api/medias/${reactiveMedia.id}`, { method: "DELETE" }).then(() => window.location.reload());
        setShowConfirmationModal(null);
      },
      onCancel: () => {
        setShowConfirmationModal(null);
      },
    });
  };

  return (
    <>
      <div class="flex gap-8">
        <div className="max-w-4xl">
          <MediaPreview media={reactiveMedia} from={"detail"} />
        </div>
        <div class="w-1/2 flex flex-col gap-5">
          {renderMediaInputs(reactiveMedia, (k, v) => setReactiveMedia({ ...reactiveMedia, [k]: v }), MediaModifiableAttributes)}
          <div class="text-text flex align-center gap-4">
            <Button text={`${updating ? "..." : "Modifier"}`} onClick={updateMedia} className={{ wrapper: "grow justify-center" }} />{" "}
            <IconTrash className={"text-error cursor-pointer"} onClick={deleteMedia} />
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal message={showConfirmationModal.message} onConfirm={showConfirmationModal.onConfirm} onCancel={showConfirmationModal.onCancel} />
      )}
    </>
  );
}
