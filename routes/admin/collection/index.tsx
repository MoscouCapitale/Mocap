
import AddButton from "@islands/collection/AddButton.tsx";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";
import { MediaType } from "@models/Medias.ts";
import { defineRoute } from "fresh/compat";

export default defineRoute((ctx) => {
  const req = ctx.req;

  interface CollectionType {
    title: string;
    apiRoute: MediaType;
  }

  const collectionTypes: CollectionType[] = [
    {
      title: "Photos",
      apiRoute: MediaType.Images,
    },
    {
      title: "Videos",
      apiRoute: MediaType.Videos,
    },
    {
      title: "Audios",
      apiRoute: MediaType.Audios,
    },
    {
      title: "Misc",
      apiRoute: MediaType.Misc,
    },
  ];

  return (
    <div class="w-full min-h-screen flex-col justify-start items-start gap-10 inline-flex">
      {collectionTypes.map((type) => (
        <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
          <div class="text-text font-bold">{type.title}</div>
          <CollectionGrid fetchingRoute={type.apiRoute} />
        </div>
      ))}
      <AddButton />
    </div>
  );
});
