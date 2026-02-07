import { RouteConfig } from "fresh";
import { defineRoute } from "fresh/compat";
import { Partial } from "fresh/runtime";

// We only want to render the content, so disable
// the `_app.tsx` template as well as any potentially
// inherited layouts
export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

export default defineRoute((ctx) => {
  const req = ctx.req;

  interface CollectionType {
    title: string;
    apiRoute: string;
  }

  return (
    <Partial name="collection-content">
      <div class="w-full min-h-screen flex-col justify-start items-start gap-10 inline-flex">
        {/* <CollectionGrid fetchingRoute={''} /> */}
      </div>
    </Partial>
  );
});
