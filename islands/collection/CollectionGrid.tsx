import CollectionTile from "@islands/collection/CollectionTile.tsx";
import { DatabaseMedia, MediaByType } from "@models/Medias.ts";
import { Audio, Image, Media, MediaType, Misc, Video } from "@models/Medias.ts";
import { useEffect, useState } from "preact/hooks";
import { filterOutNonValideAttributes } from "@utils/database.ts";
import ky from "ky";

interface GridProps {
  fetchingRoute: MediaType;
  mediaSize?: number;
  onMediaClick?: (media: Media) => void;
}

type FetchingRouteMap = {
  [MediaType.Images]: Image[];
  [MediaType.Videos]: Video[];
  [MediaType.Audios]: Audio[];
  [MediaType.Misc]: Misc[];
};

type CollectionType<T extends MediaType> = FetchingRouteMap[T];

export default function CollectionGrid(
  { fetchingRoute, mediaSize, onMediaClick }: GridProps,
) {
  const [collection, setCollection] = useState<
    CollectionType<typeof fetchingRoute>
  >();

  useEffect(() => {
    ky.get(`/api/medias/all/${fetchingRoute}`)
      .json<DatabaseMedia[]>()
      .then((data) => {
        if (!data || data === "") setCollection([])
        else setCollection(
          data?.map((media: DatabaseMedia) => filterOutNonValideAttributes(media)) as CollectionType<typeof fetchingRoute>
        );
      });
  }, [fetchingRoute]);

  return (
    <>
      {collection === undefined && (
        <div class="w-full flex justify-center items-center">
          <div class="text-text">Loading...</div>
        </div>
      )}
      {collection && collection.length > 0 && (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${mediaSize || "200"}px, 1fr))`,
            gap: "1rem",
          }}
        >
          {collection.map((media) => (
            <CollectionTile
              media={media}
              mediaClick={onMediaClick ? () => onMediaClick(media) : undefined}
            />
          ))}
        </div>
      )}
      {collection && collection.length === 0 && (
        <div class="w-full flex justify-left items-center">
          <div class="text-text">No media found</div>
        </div>
      )}
    </>
  );
}
