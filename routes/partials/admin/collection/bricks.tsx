import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import CollectionGrid from "@islands/collection/CollectionGrid.tsx";

// We only want to render the content, so disable
// the `_app.tsx` template as well as any potentially
// inherited layouts
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((req, ctx) => {
  interface CollectionType {
    title: string;
    apiRoute: string;
  }

  return (
    <Partial name="collection-content">
      <div class="w-full min-h-screen flex-col justify-start items-start gap-10 inline-flex">
        <CollectionGrid fetchingRoute="/admin/collection/bricks" />
      </div>
    </Partial>
  );
});
