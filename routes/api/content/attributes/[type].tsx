import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { createQueryFromAttributesTables, evaluateSupabaseResponse } from "@utils/api.ts";

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

    // console.log("Generated query for type", type, ":", generatedQuery?.table, generatedQuery?.query)

    if (!Object.keys(DatabaseAttributes).includes(type) || !generatedQuery) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const { data, error } = await supa.from(generatedQuery.table).select(generatedQuery.query);

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    // console.log("Queried ", type, ", query is ", generatedQuery.query, " for table " ,generatedQuery.table)
    // console.log("Data found: ", data)

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },

  // TODO: i was there, trying to implement the PUT handler. Was doing it on tracks, so test it on other attributes
  async PUT(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.keys(DatabaseAttributes).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    let body = await _req.json();
    const cleanedBody = JSON.parse(JSON.stringify(body));
    const jointAttributes: string[] = [];

    console.log("body is ", body);

    const tableName = DatabaseAttributes[type].table;

    Object.entries(body).forEach(([key, value]) => Array.isArray(body[key]) && delete cleanedBody[key] && jointAttributes.push(key));

    const { data, error } = await supa
      .from(tableName)
      .upsert({ ...cleanedBody, updated_at: new Date() })
      .select();

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    const upsertedId = data[0]?.id;

    console.log("jointAttributes: ", jointAttributes, "upsertedId: ", upsertedId);
    jointAttributes.forEach((key) => {
      console.log("key:", key, "DatabaseAttributes: ", DatabaseAttributes[key]?.table, "upsertedId: ", upsertedId);
      if (DatabaseAttributes[key] && upsertedId) {
        const jointTableName = `${tableName}_${DatabaseAttributes[key].table}`;
        console.log("body for key: ", key, "\n: ", body[key]);
        for (const attr of body[key]) {
          supa.from(jointTableName).upsert({ [type]: upsertedId, [key]: attr.id });
        }
      }
    });

    return new Response(JSON.stringify(data), {
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

    const { data, error } = await supa.from(tableName).delete().eq("id", body.id);

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
