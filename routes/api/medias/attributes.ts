import { FreshContext, Handlers } from "$fresh/server.ts";
import { Media } from "@models/Medias.ts";
import { supabase as supa } from "@services/supabase.ts";

export const handler: Handlers<any> = {
  async GET(req: Request, ctx: FreshContext) {
    let additionalAttributes = {
      controls: [] as any,
      cta: [] as any,
      object_fit: [] as any,
    };
    let res = await supa.from("Media_Adjustement").select();
    additionalAttributes.object_fit = res.data || "best";
    res = await supa.from("Audio_Controls").select();
    additionalAttributes.controls = res.data || [];
    res = await supa.from("Audio_Link").select();
    additionalAttributes.cta = res.data;
    return new Response(JSON.stringify(additionalAttributes), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
