import { defineRoute } from "$fresh/server.ts";

// import ContentWrapper from "@components/pages/ContentWrapper.tsx";
import ContentWrapper from "@islands/pages/ContentWrapper.tsx";
import BrickSidebar from "@islands/pages/BrickSidebar.tsx";

export default defineRoute((req, ctx) => {
  return (
    <div className={"w-full h-full grow flex gap-8"}>
      <ContentWrapper />
      <BrickSidebar />
    </div>
  );
});
