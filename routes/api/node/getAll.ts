import { FreshContext, Handlers } from "$fresh/server.ts";
import { MNode } from "@models/Canva.ts";
import { fetchNode } from "@services/nodes.ts";

export const handler: Handlers<MNode | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const { data, error } = await fetchNode();
    if (error) return error;
    return new Response(JSON.stringify(data), { status: 200 });
  },
};
