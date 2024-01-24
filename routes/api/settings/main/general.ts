import { FreshContext, Handlers } from "$fresh/server.ts";
import { Database } from "@models/database.ts";
import { supabase as sup } from "@services/supabase.ts";

export const handler: Handlers<
  Database["public"]["Tables"]["Website_Settings_Main_Misc"]["Row"] | []
> = {
  async GET(req: Request, ctx: FreshContext) {
    const res = await sup.from("Website_Settings_Main_Misc").select(`*`);
    return new Response(JSON.stringify(res.data), {
      headers: { "content-type": "application/json" },
    });
  },

  async PUT(req: Request) {
    const body = await req.json();
    let misc = body.misc;
    misc = { ...misc, modified_at: new Date().toISOString() };
    console.log("misc", misc);
    const fetchedMisc = await sup.from("Website_Settings_Main_Misc").select()
      .eq("id", misc.id);
    let res;
    if (fetchedMisc.data && fetchedMisc.data.length > 0) { // extrem case, if no data
      res = await sup
        .from("Website_Settings_Main_Misc")
        .update(misc)
        .eq("id", misc.id);
    } else {
      res = await sup
        .from("Website_Settings_Main_Misc")
        .insert(misc);
    }
    console.log("res", res);
    return new Response(
      JSON.stringify(res.status === 204 || res.status === 201 ? 200 : 500),
      {
        headers: { "content-type": "application/json" },
      },
    );
  },
};
