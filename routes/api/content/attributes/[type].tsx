import { authDefine } from "@utils/app.ts";
import { deleteContent, getContent, prepareContentObject, returnPBApiResponse, upsertContent } from "@utils/db.ts";

// TODO: any is not a good type
export const handler = authDefine.handlers({
  /**
   * GET handler for retrieving all attributes of a specific type (e.g. controls, cta, object_fit).
   * @param _req - The request object.
   * @param ctx - The context object containing the type parameter.
   * @returns A response object with the retrieved attributes or an error message.
   */
  async GET(ctx) {
    const type: string = ctx.params.type;
    const { pb } = ctx.state;

    const data = await getContent(pb.collection(type), -1, { expand: 'tracks' });

    return ctx.json(data);
  },

  async PUT(ctx) {
    const { pb } = ctx.state;
    const type: string = ctx.params.type;

    const attribute = prepareContentObject(await ctx.req.json(), ctx);

    const res = await upsertContent(pb.collection(type), attribute);

    return returnPBApiResponse(ctx, res);
  },

  async DELETE(ctx) {
    const { pb } = ctx.state;
    const type: string = ctx.params.type;

    const body = await ctx.req.json();

    const res = await deleteContent(pb.collection(type), body);

    return returnPBApiResponse(ctx, res);
  },
});
