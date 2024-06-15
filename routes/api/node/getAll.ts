import { FreshContext, Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { MNode } from "@models/Canva.ts";

export const handler: Handlers<MNode | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const { data, error } = await supa.from("Node").select("*");

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    return new Response(JSON.stringify(data), { status: 200 });
  },
};