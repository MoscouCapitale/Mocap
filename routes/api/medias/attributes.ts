import { supabase as supa } from "@services/supabase.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers({
  GET: async  () => {
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
});
