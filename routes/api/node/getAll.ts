import { MNode } from "@models/Canva.ts";
import { fetchNode } from "@services/nodes.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers<MNode | null>({
  async GET(ctx) {
    const req = ctx.req;
    const { data, error } = await fetchNode();
    if (error) return error;
    return new Response(JSON.stringify(data), { status: 200 });
  },
});
