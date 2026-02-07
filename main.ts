// /// <reference no-default-lib="true" />
// /// <reference lib="dom" />
// /// <reference lib="dom.iterable" />
// /// <reference lib="dom.asynciterable" />
// /// <reference lib="deno.ns" />

// import { load } from "$std/dotenv/mod.ts";

// // Need to set allowEmptyValues because the env are set using Deno Deploy secrets
// // deno-lint-ignore no-unused-vars
// const conf = await load({ allowEmptyValues: true });

// import { start } from "fresh";
// import manifest from "./fresh.gen.ts";
// import config from "./fresh.config.ts";

// await start(manifest, config);

import { App, staticFiles, trailingSlashes } from "fresh";

import declareSubscription from "./realtime/subscriptions.ts";

declareSubscription();

// Check that the local Supabase instance is running (by querying the http://localhost:54321)
try {
  await fetch(
    Deno.env.get("SUPABASE_URL") || "http://localhost:54321",
    { method: "HEAD" },
  );
} catch (error) {
    console.error(error)
  console.error(
    `%cERROR: Failed to connect to the local Supabase instance. Please ensure it is running using \`deno task supa-start\` and accessible.`,
    "color: red",
  );
  Deno.exit(1);
}

export const app = new App()
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes(); // Include file-system based routes here