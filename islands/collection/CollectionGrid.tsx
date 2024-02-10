import CollectionTile from "@islands/collection/CollectionTile.tsx";
import { useState } from "preact/hooks";

interface GridProps {
  fetchingRoute: string
}

export default function CollectionGrid({ fetchingRoute }: GridProps) {
  const [collection, setCollection] = useState<any[]>([]);

  return (
    <>
      {collection?.length > 0 ? (
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "1rem",
          }}
        ></div>
      ) : (
        <div class="w-full flex justify-center items-center">
          <div class="text-text">Loading...</div>
        </div>
      )}
    </>
  );
}
