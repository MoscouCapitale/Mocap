import { FreshContext, Handlers } from "$fresh/server.ts";
import { stylesSettings } from "@models/App.ts";
import { supabase as supa } from "@services/supabase.ts";
import {
  FetchableSettingsKeys,
  FetchableSettingsKeysArray,
} from "@models/Settings.ts";

export const handler: Handlers<stylesSettings | []> = {
  async GET(_req: Request, ctx: FreshContext) {
    const { type } = ctx.params;

    if (!FetchableSettingsKeysArray.includes(type as FetchableSettingsKeys)) {
      return new Response(null, { status: 400 });
    }

    const { data, error } = await supa.from("Settings").select(
      `id, user, ${type}`,
    )

    // FIXME: add correct supabase error manager (after canva update)

    if (!data || (Array.isArray(data) && !data.length) || error) {
      return new Response(null, { status: 204 });
    }
    // FIXME: hadrcode id to 0. For now we'll only support "general" settings, but it will change with settings by-users
    return new Response(JSON.stringify(data[0][type]), { status: 200 });
  },

  async POST(req: Request, ctx: FreshContext) {
    const { type } = ctx.params;

    if (!FetchableSettingsKeysArray.includes(type as FetchableSettingsKeys)) {
      return new Response(null, { status: 400 });
    }

    let body = await req.json();
    // FIXME: hadrcode id to 0. For now we'll only support "general" settings, but it will change with settings by-users
    body = { id: 0, updated_at: new Date().toISOString(), [type]: body };

    console.log("Body is now: ", body);

    try {
      const { error } = await supa
        .from("Settings")
        .upsert(body);
      if (error) throw error;
      return new Response(null, { status: 200 });
    } catch (e) {
      console.error("Error while saving main settings: ", e);
      return new Response(null, { status: 500 });
    }
  },
};
