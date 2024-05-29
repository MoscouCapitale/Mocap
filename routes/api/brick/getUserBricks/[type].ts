import { FreshContext, Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { DatabaseAttributes } from "@models/App.ts";
import {
  createQueryFromAttributesTables,
  evaluateSupabaseResponse,
} from "@utils/api.ts";
import { BricksType } from "@models/Bricks.ts";

export const handler: Handlers<any | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const type = ctx.params.type;

    if (!type || !Object.keys(BricksType).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    // const tableName = `Bricks_${BricksType[type as keyof typeof BricksType]}`;
    const tableName = `Bricks_${type}`;

    // We need to go through the bricks attributes and create a query that will fetch all nested datas
    const nestedAttributes = Object.entries(DatabaseAttributes).filter(([key, _value]) => {
      return DatabaseAttributes[key].parentTables?.includes(tableName)
    })
    const nestedQuery = '*' + nestedAttributes?.map(([key, _val], index) => {
      return `${index === 0 ? ', ' : ''}` + createQueryFromAttributesTables(key, false, true)?.query
    })

    const { data, error } = await supa.from(tableName).select(nestedQuery);

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
