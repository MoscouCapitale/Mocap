/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";
import { load } from "$std/dotenv/mod.ts";

// Need to set allowEmptyValues because the env are set using Deno Deploy secrets
const _conf = await load({ allowEmptyValues: true });

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

await start(manifest, config);
