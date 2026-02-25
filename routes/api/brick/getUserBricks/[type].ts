import { EBrickType, IBrick } from "@models/Bricks.ts";
import { authDefine } from "@utils/app.ts";

export const handler = authDefine.handlers({
  async GET(ctx) {
    const { pb } = ctx.state;
    const type = ctx.params.type as EBrickType;
    // const res = await getBrickFromType(type as keyof typeof BricksType, undefined, true);

    const data = await pb.collection<IBrick<typeof type>>('bricks').getFullList({
      filter: `type="${type}"`,
    });

    return ctx.json(data);
  },
});
