import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { createQueryFromAttributesTables, evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { TableNames } from "@models/database.ts";

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

    const generatedQuery = createQueryFromAttributesTables(type);

    if (!Object.keys(DatabaseAttributes).includes(type) || !generatedQuery) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const { data, error } = await supa.from(generatedQuery.table as TableNames).select(generatedQuery.query);

    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },

  async PUT(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.keys(DatabaseAttributes).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const body = await _req.json();
    const cleanedBody = JSON.parse(JSON.stringify(body));
    const jointAttributes: string[] = [];

    console.log(`Inserting ${type} with body:`, body);

    const tableName = DatabaseAttributes[type].table;

    Object.entries(body).forEach(([key, value]) => Array.isArray(body[key]) && delete cleanedBody[key] && jointAttributes.push(key));

    const { data, error } = await supa
      .from(tableName as TableNames)
      .upsert({ ...cleanedBody, updated_at: new Date() })
      .select();

    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    // @ts-expect-error - Data is not null
    const upsertedId = data[0]?.id;

    for (const key of jointAttributes) {
      if (DatabaseAttributes[key] && upsertedId) {
        const jointTableName = `${tableName}_${DatabaseAttributes[key].table}`;
        for (const attr of body[key]) await supa.from(jointTableName as TableNames).upsert({ [type]: upsertedId, [key]: attr.id });
      }
    };

    const generatedQuery = createQueryFromAttributesTables(type);
    if (!generatedQuery) return new Response(`An unexpected error occured.`, { status: 500 });

    const { data: res, error: resError } = await supa.from(generatedQuery.table as TableNames).select(generatedQuery.query);
    if (evaluateSupabaseResponse(res, resError)) return returnErrorReponse(res, resError);

    return new Response(res ? JSON.stringify(res[0]) : null, {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },

  async DELETE(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.keys(DatabaseAttributes).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const body = await _req.json();

    const tableName = DatabaseAttributes[type].table;

    const { data, error } = await supa.from(tableName as TableNames).delete().eq("id", body.id);

    if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
