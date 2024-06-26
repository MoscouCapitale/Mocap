import { FreshContext, Handlers } from "$fresh/server.ts";
import { BricksType } from "@models/Bricks.ts";
import { getBrickFromType } from "@services/bricks.ts";

export const handler: Handlers<any | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const type = ctx.params.type;
    const res = await getBrickFromType(type as keyof typeof BricksType);

    // @ts-ignore - If error is set it means that res is not a MNode
    if (res.error) return new Response(res.error, { status: res.status });

    return new Response(JSON.stringify(res), { status: 200 });
  },
};
