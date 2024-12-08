import { defineRoute } from "$fresh/server.ts";

import MCPageWRapper from "@islands/pages/MCPageWrapper.tsx";

export default defineRoute((req, ctx) => {
  return (
    <>
      <link rel="stylesheet" href="/cardsglow.css" />
      <MCPageWRapper />;
    </>
  );
});
