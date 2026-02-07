import { FreshContext } from "fresh";
import { MNode } from "@models/Canva.ts";
import { fetchNode } from "@services/nodes.ts";
import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers<MNode | null>({
  async GET(ctx) {
    const req = ctx.req;
    const { uid } = ctx.params;

    if (!uid) {
      return new Response("Invalid id", { status: 400 });
    }

    const { data, error } = await fetchNode(uid);
    if (error) return error;
    return new Response(JSON.stringify(data ? data[0] : null), { status: 200 });
  },

  async DELETE(ctx) {
    const req = ctx.req;
    const { uid } = ctx.params;

    if (!uid) {
      return new Response("Invalid id", { status: 400 });
    }

    const { data, error } = await supa.from("Node").delete().eq("id", uid);
    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    return new Response(null, { status: 204 });
  },
});
