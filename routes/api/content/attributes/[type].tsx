import { DatabaseAttributes } from "@models/App.ts";
import { TableNames } from "@models/database.ts";
import { supabase as supa } from "@services/supabase.ts";
import { createQueryFromAttributesTables, evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { authDefine } from "@utils/app.ts";

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
    
    const data = await pb.collection(type).getFullList();
        
    return ctx.json(data);
  },
  
  //TODO: was here
  /**
   * trying to create an attribute record. getting 400 error. now is time to
   * - fix pb typing
   * - handle pb errors to return correcty errors
   */
  async PUT(ctx) {
    const { pb } = ctx.state;
    const type: string = ctx.params.type;
    
    let attribute = await ctx.req.json();
    
    if (attribute?.id) {
      attribute = await pb.collection(type).update(attribute?.id, attribute);
    } else {
      attribute = await pb.collection(type).create(attribute);
    }
    
    return ctx.json(attribute);
  },

  async DELETE(ctx) {
    const { pb } = ctx.state;
    const type: string = ctx.params.type;

    const body = await ctx.req.json();

    await pb.collection(type).delete(body?.id);

    return ctx.json({})
  },
});
