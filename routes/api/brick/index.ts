import { FreshContext, Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import {
  availBricks,
  BricksType,
  getBrickTypeTableName,
  PlatformLink,
  Track,
} from "@models/Bricks.ts";
import { TableNames } from "@models/database.ts";
import { createOrUpdateNodeFromBrick } from "@services/nodes.ts";
import { isEmpty } from "lodash";

export const handler: Handlers<any | null> = {
  async PUT(req: Request, ctx: FreshContext) {
    const body = await req.json();

    const type = body.type;
    const withCanvaInsert = body.withCanvaInsert;

    if (!Object.values(BricksType).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const brick = body.data;
    // console.log("raw brick is ", brick);
    const tableName = getBrickTypeTableName(type);

    // Remove some attributes that are not in the database
    const attr_isActive = brick.isActive;
    delete brick.isActive;
    let attr_nodeId = brick.nodeId ?? null;
    delete brick.nodeId;
    delete brick.type; // On brick update, the type is specified, but we don't want to save it

    // Save many-to-many relationships ids
    const linkedTables: ({ [key: string]: number[] } | undefined)[] = Object
      .entries(brick)
      .map(([key, value]) => {
        if (
          Array.isArray(value) &&
          DatabaseAttributes[key]?.parentTables?.includes(`Bricks_${type}`)
        ) {
          const res = {
            [key]: brick[key].map((item: PlatformLink | Track) => item.id),
          };
          delete brick[key];
          return res;
        }
      }).filter(Boolean);

    // Set one-to-one relationships to the id of the linked object
    Object.entries(brick).forEach(([key, value]) => {
      if (value && typeof value === "object" && "id" in value) {
        brick[key] = brick[key].id;
      }
      if (typeof value === "object" && isEmpty(value)) brick[key] = null;
    });

    // Save the brick
    const { data, error } = await supa.from(tableName).upsert({
      ...brick,
      updated_at: new Date(),
    }).select();

    if (evaluateSupabaseResponse(data, error)) {
      return returnErrorReponse(data, error);
    }

    const brickId = data[0].id;
    // Save linked tables
    try {
      if (linkedTables) {
        for (const obj of linkedTables) {
          if (!obj) continue;
          const [ltkey, ltval] = Object.entries(obj)[0];
          if (
            Array.isArray(ltval) &&
            DatabaseAttributes[ltkey]?.parentTables?.includes(
              `Bricks_${type}`,
            ) &&
            brickId
          ) {
            const linkedTableName = `${tableName}_${
              DatabaseAttributes[ltkey].table
            }` as TableNames;
            // first delete all the previous links
            await supa.from(linkedTableName).delete().eq(type, brickId);

            // then insert the new ones
            const bulkInsert = ltval.map((id: number) => (id && {
              [type]: brickId.toString(),
              [DatabaseAttributes[ltkey].table]: id.toString(),
            }));
            await supa.from(linkedTableName).insert(bulkInsert);
          }
        }
      }
    } catch (e) {
      console.error("Error while saving linked tables: ", e);
    }

    const savedBrick = data[0];
    console.log("Saved bricks. Finishing");

    // Create a node for the brick
    let newNode = null;
    // TODO: I think it would be better to either create a dedicated endpoint for canva insert
    if (withCanvaInsert) {
      newNode = await createOrUpdateNodeFromBrick(
        savedBrick as availBricks,
        attr_nodeId,
        type,
      );
      if (!newNode) {
        console.error("Error while creating node for brick ", savedBrick);
      }
    }

    console.log("Returning response");
    return new Response(
      JSON.stringify({
        ...savedBrick,
        isActive: attr_isActive,
        nodeId: attr_nodeId,
        newNode,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  },

  async DELETE(req: Request, ctx: FreshContext) {
    const body = await req.json();

    const type = body.type;

    if (!Object.keys(BricksType).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const brick = body.data;

    const tableName = getBrickTypeTableName(type);

    const { data, error } = await supa.from(tableName).delete().eq(
      "id",
      brick.id,
    );

    if (evaluateSupabaseResponse(data, error)) {
      return returnErrorReponse(data, error);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
