import { FreshContext, Handlers } from "$fresh/server.ts";
import { MNode } from "@models/Canva.ts";
import { fetchNode } from "@services/nodes.ts";
import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";

export const handler: Handlers<MNode | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const { uid } = ctx.params;

    if (!uid) {
        return new Response("Invalid id", { status: 400 });
    }

    const { data, error } = await fetchNode(uid, true);
    if (error) return error;
    return new Response(JSON.stringify(data ? data[0] : null), { status: 200 });
  },

  async DELETE(req: Request, ctx: FreshContext) {
    const { uid } = ctx.params;

    if (!uid) {
        return new Response("Invalid id", { status: 400 });
    }

    const { data, error } = await supa.from("Node").delete().eq('id', uid)
    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    return new Response(null, { status: 204 });
  }
};
