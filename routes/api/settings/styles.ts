import { FreshContext, Handlers } from "$fresh/server.ts";
import { stylesSettings } from "@models/App.ts";
import { supabase as sup } from "@services/supabase.ts";

export const handler: Handlers<
  stylesSettings | []
> = {
  async GET(req: Request, ctx: FreshContext) {
    const res = await sup.from("Website_Settings_Styles").select();
    return new Response(JSON.stringify(res.data), {
      headers: { "content-type": "application/json" },
    });
  },

  async POST(req: Request) {
    let body = await req.json();
    body = { ...body, modified_at: new Date().toISOString() };
    const fetchedMedias = await sup.from("Website_Settings_Styles").select()
      .eq("id", body.id);
    let res;
    if (fetchedMedias.data && fetchedMedias.data.length > 0) { // extrem case, if no data
      res = await sup
        .from("Website_Settings_Styles")
        .update(body)
        .eq("id", body.id);
    } else {
      res = await sup
        .from("Website_Settings_Styles")
        .insert(body);
    }
    return new Response(
      JSON.stringify(res.status === 204 || res.status === 201 ? 200 : 500),
      {
        headers: { "content-type": "application/json" },
      },
    );
  },
};
