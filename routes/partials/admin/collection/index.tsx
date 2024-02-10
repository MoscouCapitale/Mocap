import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

import CollectionGrid from "@islands/collection/CollectionGrid.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((req, ctx) => {
  interface CollectionType {
    title: string;
    apiRoute: string;
  }

  const collectionTypes: CollectionType[] = [
    {
      title: "Photos",
      apiRoute: "/admin/collection/photos",
    },
    {
      title: "Videos",
      apiRoute: "/admin/collection/videos",
    },
    {
      title: "Audios & Misc",
      apiRoute: "/admin/collection/audios",
    },
  ];

  return (
    <Partial name="collection-content">
      <div class="w-full min-h-screen flex-col justify-start items-start gap-10 inline-flex">
        {collectionTypes.map((type) => (
          <div class="w-full flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="text-text font-bold">{type.title}</div>
            <CollectionGrid fetchingRoute={type.apiRoute} />
          </div>
        ))}
      </div>
    </Partial>
  );
});
