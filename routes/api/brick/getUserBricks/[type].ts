import { EBrickType, IBrick } from "@models/Bricks.ts";
import { authDefine } from "@utils/app.ts";
import { getContent } from "@utils/db.ts";

export const handler = authDefine.handlers({
  async GET(ctx) {
    const { pb } = ctx.state;
    const type = ctx.params.type as EBrickType;
    
    const data = await getContent(pb.collection<IBrick<typeof type>>('bricks'), 'x', {
      filter: pb.filter("type = {:type}", { type }),
      expand: "link,album"
    })

    return ctx.json(data);
  },
});
