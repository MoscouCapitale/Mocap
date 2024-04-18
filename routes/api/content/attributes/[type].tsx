import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { MediaTableNames } from "@models/Medias.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";

// TODO: any is not a good type
export const handler: Handlers<any | null> = {
  /**
   * GET handler for retrieving all attributes of a specific type (e.g. controls, cta, object_fit).
   * @param _req - The request object.
   * @param ctx - The context object containing the type parameter.
   * @returns A response object with the retrieved attributes or an error message.
   */
  async GET(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.keys(MediaTableNames).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    // @ts-ignore - TODO: fix this thing
    const { data, error } = await supa.from(MediaTableNames[type]).select('*');

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },

  async PUT(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.keys(MediaTableNames).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const body = await _req.json();

    // @ts-ignore - TODO: fix this thing
    const { data, error } = await supa.from(MediaTableNames[type]).upsert({...body, updated_at: new Date()}).select();

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }
};