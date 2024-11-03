import { DatabaseAttributes } from "@models/App.ts";
import { PlatformLink } from "@models/Bricks.ts";
import { supabase as supa } from "@services/supabase.ts";
import { createQueryFromAttributesTables, evaluateSupabaseResponse } from "@utils/api.ts";
import { encodeHex } from "jsr:@std/encoding/hex";

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

  return data as unknown as PlatformLink[];
};

export const verifyBetaCode = async (code: string, isHashed?: boolean) => {
  let hash = code;
  if (!isHashed) {
    hash = await getHashedCode(code);
  }

  const envHashDelimiter = "/*BC*/";

  const codes = Deno.env.get("BETA_CODES")?.split(envHashDelimiter).map((code) => code.trim());

  return codes?.includes(hash);
};

export const getHashedCode = async (code: string) => {
  const hex = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  return encodeHex(hex);
};
