import { FreshContext, Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { BricksType, PlateformLink, Track } from "@models/Bricks.ts";
import { createNodeFromBrick } from "@services/bricks.ts";

export const handler: Handlers<any | null> = {
  async PUT(req: Request, ctx: FreshContext) {
    const body = await req.json();

    const type = body.type;
    const withCanvaInsert = body.withCanvaInsert

    
    if (!Object.keys(BricksType).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }
    
    const brick = body.data;
    // console.log("raw brick is ", brick);
    const tableName = `Bricks_${BricksType[type as keyof typeof BricksType]}`;

    // Remove some attributes that are not in the database
    delete brick.isActive;

    // Save many-to-many relationships ids
    const linkedTables: ({ [key: string]: number[] } | undefined)[] = Object
      .entries(brick)
      .map(([key, value]) => {
        if (
          Array.isArray(value) &&
          DatabaseAttributes[key]?.parentTables?.includes(`Bricks_${type}`)
        ) {
          const res = {
            [key]: brick[key].map((item: PlateformLink | Track) => item.id),
          };
          delete brick[key];
          return res;
        }
      }).filter(Boolean);

    // Set one-to-one relationships to the id of the linked object
    Object.entries(brick).forEach(([key, value]) => {
      if (value && typeof value === "object") {
        brick[key] = brick[key].id || null;
      }
    });

    // Save the brick
    const { data, error } = await supa.from(tableName).upsert({
      ...brick,
      updated_at: new Date(),
    }).select();

    const badRes = evaluateSupabaseResponse(data, error);
    if (badRes) return badRes;

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
            }`;
            // first delete all the previous links
            await supa.from(linkedTableName).delete().eq(type, brickId);

            // then insert the new ones
            const bulkInsert = ltval.map((id: number) => (id && {
              [type]: brickId,
              [DatabaseAttributes[ltkey].table]: id,
            }));
            await supa.from(linkedTableName).insert(bulkInsert);
          }
        }
      }
    } catch (e) {
      console.error("Error while saving linked tables: ", e);
    }

    const savedBrick = data[0];
    console.log("Saved bricks. Finishing")

    // Create a node for the brick
    if (withCanvaInsert) {
      console.log("Generating MNode from brick")
      const node = await createNodeFromBrick(type as keyof typeof BricksType, savedBrick);
      console.log("Node is ", node)
      if (!node) {
        console.error("Error while creating node for brick ", savedBrick);
      }
    }

    console.log("Returning response")
    return new Response(JSON.stringify(savedBrick), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },

  async DELETE(req: Request, ctx: FreshContext) {
    const body = await req.json();

    const type = body.type;

    if (!Object.keys(BricksType).includes(type)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const brick = body.data;

    const tableName = `Bricks_${BricksType[type as keyof typeof BricksType]}`;

    const { data, error } = await supa.from(tableName).delete().eq(
      "id",
      brick.id,
    );

    // TODO: delete all the linked tables
    // delete all the linked tables
    // const linkedTables = Object.entries(DatabaseAttributes).filter(
    //   ([key, value]) =>
    //     value.parentTables?.includes(`Bricks_${type}`),
    // );
    // for (const [key, value] of linkedTables) {
    //   const linkedTableName = `${tableName}_${value.table}`;
    //   await supa.from(linkedTableName).delete().eq(type, brick.id);
    // }

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
