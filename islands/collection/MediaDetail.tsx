import Button from "@islands/Button.tsx";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import ConfirmationModal from "@islands/ConfirmationModal.tsx";
import ContentForm, { ContentFormValue } from "@islands/UI/ContentForm.tsx";
import { getMediaFormFromType } from "@models/forms/media.ts";
import { Audio, DatabaseMedia, Image, MediaByType, MediaType, Misc, Video } from "@models/Medias.ts";
import { cn } from "@utils/cn.ts";
import { filterOutNonValideAttributes } from "@utils/database.ts";
import { IconTrash } from "@utils/icons.ts";
import { useMemo, useState } from "preact/hooks";

interface MediaDetailProps {
  media: Image | Video | Audio | Misc;
}

export default function MediaDetail({ media }: MediaDetailProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [reactiveMedia, setReactiveMedia] = useState<
    Image | Video | Audio | Misc
  >(media);
  const [mediaState, setMediaState] = useState<"new" | "update" | "updating" | "updatedone">(
    media?.id ? "update" : "new",
  );

  const updateMedia = () => {
    if (reactiveMedia.id) {
      setMediaState("updating");
      fetch(`/api/medias/${reactiveMedia.id}`, {
        method: "PUT",
        body: JSON.stringify(reactiveMedia),
      })
        .then((res) => res.json())
        .then((data: DatabaseMedia[]) => {
          data[0] &&
            setReactiveMedia(
              filterOutNonValideAttributes(data[0]) as MediaByType<MediaType>,
            );
        }).finally(() => setMediaState("updatedone"));
    }
  };

  const onDeleteMediaClick = () => setShowConfirmationModal(true);
  const onConfirmDeleteMedia = () => {
    reactiveMedia.id &&
      fetch(`/api/medias/${reactiveMedia.id}`, { method: "DELETE" }).then(
        () => window.location.reload(),
      );
    setShowConfirmationModal(false);
  };

  const buttonLabel = useMemo(() => {
    switch (mediaState) {
      case "new":
        return "Ajouter";
      case "update":
        return "Modifier";
      case "updating":
        return "...";
      case "updatedone":
        setTimeout(() => setMediaState("update"), 5000);
        return "Média mis à jour";
    }
  }, [mediaState]);

  return (
    <>
      <div class="flex gap-8">
        <div
          className={cn(
            "max-w-4xl",
            media.type === MediaType.Misc ? "w-[200px]" : "w-[500px]", // Set a fixed width, to avoid making the media jump when the form is updated (on object_fit change for example)
          )}
        >
          <MediaPreview media={reactiveMedia} from={"detail"} />
        </div>
        <div class="w-1/2 flex flex-col gap-5">
          <div class="flex flex-col gap-6 flex-wrap">
            <ContentForm
              form={getMediaFormFromType(media.type)}
              initialData={media as unknown as ContentFormValue}
              setDatas={setReactiveMedia as unknown as (
                value: ContentFormValue,
              ) => void}
            />
          </div>

          <div class="text-text flex align-center gap-4">
            <Button
              text={buttonLabel}
              onClick={updateMedia}
              className={{ wrapper: "grow justify-center" }}
            />{" "}
            <IconTrash
              className={"text-error cursor-pointer"}
              onClick={onDeleteMediaClick}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmationModal}
        message={"Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible."}
        onConfirm={onConfirmDeleteMedia}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </>
  );
}
