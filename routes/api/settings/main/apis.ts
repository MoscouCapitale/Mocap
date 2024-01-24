import { FreshContext, Handlers } from "$fresh/server.ts";
import { Database } from "@models/database.ts";
import { supabase as sup } from "@services/supabase.ts";

export const handler: Handlers<
  Database["public"]["Tables"]["Website_Settings_Main_APIs"]["Row"] | []
> = {
  async GET(req: Request, ctx: FreshContext) {
    const res = await sup.from("Website_Settings_Main_APIs").select();
    return new Response(JSON.stringify(res.data), {
      headers: { "content-type": "application/json" },
    });
  },

  // TODO: secure encrypt API keys
  async PUT(req: Request) {
    const body = await req.json();
    let apis = body.apis;
    apis = { ...apis, modified_at: new Date().toISOString() };
    const fetchedAPIs = await sup.from("Website_Settings_Main_APIs").select()
      .eq("id", apis.id);
    let res;
    if (fetchedAPIs.data && fetchedAPIs.data.length > 0) { // extrem case, if no data
      res = await sup
        .from("Website_Settings_Main_APIs")
        .update(apis)
        .eq("id", apis.id);
    } else {
      res = await sup
        .from("Website_Settings_Main_APIs")
        .insert(apis)
    }
    console.log('res', res);
    return new Response(JSON.stringify(res.status === 204 || res.status === 201 ? 200 : 500), {
      headers: { "content-type": "application/json" },
    });
  },
};
