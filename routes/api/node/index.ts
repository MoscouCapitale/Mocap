import { FreshContext } from "fresh";
import { MNode } from "@models/Canva.ts";
import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers<MNode[] | null>({
  async PUT(ctx) {
    const req = ctx.req;
    const body = await req.json();

    const { nodes } = body;

    if (!nodes || nodes.length === 0) {
      return new Response("Body 'nodes' is missing", { status: 400 });
    }

    // Remove some attributes that are not in the database
    nodes.forEach((node: any) => {
      delete node.content;
      delete node.sizes; // TODO: save sizes
    });

    const { data, error } = await supa.from("Node").upsert(nodes).select();
    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    return new Response(JSON.stringify(data as unknown as MNode[] ?? null), { status: 200 });
  },
});
