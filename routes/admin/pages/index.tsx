import { defineRoute } from "$fresh/server.ts";

// import ContentWrapper from "@components/pages/ContentWrapper.tsx";
import CWrapper from "@islands/pages/ContentWrapper.tsx";
import BrickSidebar from "@islands/pages/BrickSidebar.tsx";
import { MNodeProvider } from "@contexts/MNodeContext.tsx";
import MCPageWRapper from "@islands/pages/MCPageWrapper.tsx";

export default defineRoute((req, ctx) => {
  return <MCPageWRapper />;
});
