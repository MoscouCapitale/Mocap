import MCPageWRapper from "@islands/pages/MCPageWrapper.tsx";
import { defineRoute } from "fresh/compat";

export default defineRoute((ctx) => {
  const req = ctx.req;

  return (
    <>
      <link rel="stylesheet" href="/cardsglow.css" />
      <MCPageWRapper />
    </>
  );
});
