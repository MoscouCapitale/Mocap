import { FreshContext, Handlers } from "$fresh/server.ts";
import { mediasSettings } from "@models/App.ts";
import { supabase as sup } from "@services/supabase.ts";

export const handler: Handlers<
  mediasSettings | []
> = {
  async GET(req: Request, ctx: FreshContext) {
    const res = await sup.from("Website_Settings_Medias").select();
    return new Response(JSON.stringify(res.data), {
      headers: { "content-type": "application/json" },
    });
  },

  async POST(req: Request) {
    let body = await req.json();
    body = { ...body, modified_at: new Date().toISOString() };
    console.log(body);
    const fetchedMedias = await sup.from("Website_Settings_Medias").select()
      .eq("id", body.id);
    let res;
    if (fetchedMedias.data && fetchedMedias.data.length > 0) { // extrem case, if no data
      res = await sup
        .from("Website_Settings_Medias")
        .update(body)
        .eq("id", body.id);
    } else {
      res = await sup
        .from("Website_Settings_Medias")
        .insert(body);
    }
    console.log(res);
    return new Response(
      JSON.stringify(res.status === 204 || res.status === 201 ? 200 : 500),
      {
        headers: { "content-type": "application/json" },
      },
    );
  },
};
