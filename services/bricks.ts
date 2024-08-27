import { availBricks, BricksType } from "@models/Bricks.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { createQueryFromAttributesTables } from "@utils/api.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { supabase as supa } from "@services/supabase.ts";
import { TableNames } from "@models/database.ts";

export const getBrickFromType = async (
  type: keyof typeof BricksType,
  id?: number,
  getNodeId?: boolean, // Get the associated node id for the Node table
): Promise<{
  data: [availBricks] | null;
  error: string | null;
}> => {
  if (!type || !Object.keys(BricksType).includes(type)) {
    return { data: null, error: `${type} is not a valid type` };
  }

  // const tableName = `Bricks_${BricksType[type as keyof typeof BricksType]}`;
  const tableName = type === "Platform_Link"
    ? type
    : `Bricks_${type}` as TableNames;

  // We need to go through the bricks attributes and create a query that will fetch all nested datas
  const nestedAttributes = Object.entries(DatabaseAttributes).filter(
    ([key, _value]) => {
      return DatabaseAttributes[key].parentTables?.includes(tableName);
    },
  );
  const nestedQuery = "*" + nestedAttributes?.map(([key, _val], index) => {
    return `${index === 0 ? ", " : ""}` +
      createQueryFromAttributesTables(key, false, true)?.query;
  });

  const { data: rawData, error } = id
    ? await supa.from(tableName).select(nestedQuery).eq("id", id)
    : await supa.from(tableName).select(nestedQuery);

  if (!rawData || !rawData.length) return { data: null, error: null };
  if (evaluateSupabaseResponse(rawData, error)) return { data: null, error: "Error while fetching bricks" };

  const data = rawData as unknown as [availBricks];
  if (getNodeId && data && data.length > 0) {
    for (const d of data) {
      if (d.id) {
        const { data: node, error: nodeError } = await supa.from("Node").select(
          "id",
        ).eq("type", type).eq(type, d.id);
        if (!nodeError && node && node.length > 0) {
          d.nodeId = node[0].id;
        }
      }
    }
  }

  const typedData = data as unknown as [availBricks];
  return { data: typedData, error: null };
};
