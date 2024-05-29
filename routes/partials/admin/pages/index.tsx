import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";

import ContentWrapper from "@components/pages/ContentWrapper.tsx";
import BrickSidebar from "@islands/pages/BrickSidebar.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((req, ctx) => {
  return (
    <Partial name="pages-content">
      <div className={"w-full h-full grow flex gap-8"}>
        <ContentWrapper />
        <BrickSidebar />
      </div>
    </Partial>
  );
});
