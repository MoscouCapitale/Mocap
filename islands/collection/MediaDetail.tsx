import {ConfirmationModal, Button, ContentForm } from "@islands/UI";
import MediaPreview from "@islands/collection/MediaPreview.tsx";
import { ContentFormValue } from "@islands/UI/Forms/ContentForm.tsx";
import { getMediaFormFromType } from "@models/forms/media.ts";
import { Audio, DatabaseMedia, Image, MediaByType, MediaType, Misc, Video } from "@models/Medias.ts";
import { cn } from "@utils/cn.ts";
import { filterOutNonValideAttributes } from "@utils/database.ts";
import { IconTrash } from "@utils/icons.ts";
import { useMemo, useState } from "preact/hooks";
import ky from "ky";

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
      ky.put(`/api/medias/${reactiveMedia.id}`, { json: reactiveMedia })
        .then(() => {
          /** FIXME: This is a temporary fix, to allow for the media to be fully updated before reloading the page.
           * The correct solution should be to refacto the collection grid system a bit to use a context,
           * to allow for updating the media in the grid without reloading the page.
          */
          globalThis.location.reload();
        })
        .finally(() => setMediaState("updatedone"));
    }
  };

  const onDeleteMediaClick = () => setShowConfirmationModal(true);
  const onConfirmDeleteMedia = () => {
    reactiveMedia.id && ky.delete(`/api/medias/${reactiveMedia.id}`).then(() => window.location.reload());
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
              onClick={updateMedia}
              className={{ wrapper: "grow justify-center" }}
            >{buttonLabel}</Button>
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
