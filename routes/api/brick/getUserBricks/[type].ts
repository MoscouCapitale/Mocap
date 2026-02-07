import { BricksType } from "@models/Bricks.ts";
import { getBrickFromType } from "@services/bricks.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const type = ctx.params.type;
    const res = await getBrickFromType(type as keyof typeof BricksType, undefined, true);

    // @ts-ignore - If error is set it means that res is not a MNode
    if (res.error) return new Response(res.error, { status: res.status });

    return new Response(JSON.stringify(res.data), { status: 200 });
  },
});
