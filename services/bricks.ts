import { Album, BricksType, HeroSection, PlateformLink, Single } from "@models/Bricks.ts";
import { DatabaseAttributes } from "@models/App.ts";
import { createQueryFromAttributesTables } from "@utils/api.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { supabase as supa } from "@services/supabase.ts";

export const getBrickFromType = async (
  type: keyof typeof BricksType,
  id?: number,
): Promise<HeroSection | Single | Album | Text | PlateformLink | { error: string, status: number }> => {
  if (!type || !Object.keys(BricksType).includes(type)) {
    // return new Response(`${type} is not a valid type`, { status: 400 });
    return { error: `${type} is not a valid type`, status: 400 };
  }

  // const tableName = `Bricks_${BricksType[type as keyof typeof BricksType]}`;
  const tableName = type === "Platform_Link" ? type : `Bricks_${type}`;

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

  const { data, error } = id ? await supa.from(tableName).select(nestedQuery).eq("id", id) : await supa.from(tableName).select(nestedQuery);

  const badRes = evaluateSupabaseResponse(data, error);
  if (badRes) return { error: badRes.statusText, status: badRes.status };

  return data;
};