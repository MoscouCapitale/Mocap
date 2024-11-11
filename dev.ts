#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";
import declareSubscription from "./realtime/subscriptions.ts";

declareSubscription();

// Check that the local Supabase instance is running (by querying the http://localhost:54321)
try {
  await fetch(
    Deno.env.get("SUPABASE_URL") || "http://localhost:54321",
    { method: "HEAD" },
  );
} catch (error) {
  console.error(
    `%cERROR: Failed to connect to the local Supabase instance. Please ensure it is running using \`deno task supa-start\` and accessible.`,
    "color: red",
  );
  Deno.exit(1);
}

await dev(import.meta.url, "./main.ts", config);
