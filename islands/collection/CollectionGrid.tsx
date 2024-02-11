import CollectionTile from "@islands/collection/CollectionTile.tsx";
import { Media } from "@models/Medias.ts";
import { useEffect, useState } from "preact/hooks";

interface GridProps {
  fetchingRoute: string;
}

export default function CollectionGrid({ fetchingRoute }: GridProps) {
  const [collection, setCollection] = useState<Media[] | null>([]);

  useEffect(() => {
    fetch(`/api/medias/all/${fetchingRoute}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCollection(data);
      });

      fetch(`/api/medias/${fetchingRoute}`)
  }, [fetchingRoute]);

  return (
    <>
      {!collection && (
        <div class="w-full flex justify-center items-center">
          <div class="text-text">Loading...</div>
        </div>
      )}
      {collection && collection.length > 0 && (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {collection.map((media: Media) => (
            <CollectionTile media={media} />
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
