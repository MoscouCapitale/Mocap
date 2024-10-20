import { DatabaseAttributes } from "@models/App.ts";
import { PlatformLink } from "@models/Bricks.ts";
import { supabase as supa } from "@services/supabase.ts";
import {
  createQueryFromAttributesTables,
  evaluateSupabaseResponse,
} from "@utils/api.ts";

export const getFooterLinks = async (): Promise<PlatformLink[] | null> => {
  // We need to go through the bricks attributes and create a query that will fetch all nested datas
  const nestedAttributes = Object.entries(DatabaseAttributes).filter(
    ([key, _value]) => {
      return DatabaseAttributes[key].parentTables?.includes("Platform_Link");
    },
  );
  const nestedQuery = "*" + nestedAttributes?.map(([key, _val], index) => {
    return `${index === 0 ? ", " : ""}` +
      createQueryFromAttributesTables(key, false, true)?.query;
  });

  const { data, error } = await supa.from("Platform_Link").select(nestedQuery)
    .eq("in_footer", true);
  const badRes = evaluateSupabaseResponse(data, error);
  if (badRes) return null;

  return data;
};
