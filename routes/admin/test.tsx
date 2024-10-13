import { defineRoute } from "$fresh/server.ts";

import Video from "@islands/Video.tsx";

export default defineRoute((req, ctx) => {
  return (
    <div class="w-full min-h-screen flex-col justify-start items-start gap-10 inline-flex">
      <Video />
    </div>
  );
});
