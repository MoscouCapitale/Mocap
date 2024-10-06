import { PostgrestError } from "https://esm.sh/v135/@supabase/postgrest-js@1.15.2/dist/module/index.js";
import { DatabaseAttributes } from "@models/App.ts";

/**
 * Throw an bad response if there is an error or the data is empty.
 *
 * Also logs the error if there is one.
 *
 * @param {any} data - The data to be checked.
 * @param {Error} error - The error to be checked.
 * @returns {Response | null} A response object with the error message or null if the data is not empty.
 */
export const evaluateSupabaseResponse = (
  data: any,
  error: Error | PostgrestError | null,
): boolean => {
  if (error || (!data || data.length === 0)) return true;
  return false;
};

// TODO: detail more the response message
export const returnErrorReponse = (
  data: any,
  error: Error | PostgrestError | null,
): Response => {
  console.error(
    "=========Error while fetching data=========\n",
    "error: ",
    error,
    "\ndata: ",
    data,
  );
  if (Array.isArray(data) && data.length === 0) {
    return new Response(null, { status: 204 });
  }

  return new Response("Server error", { status: 500 });
};

export const createQueryFromAttributesTables = (
  attribute: string,
  isChild?: boolean,
  getAttribute?: boolean,
): { table: string; query: string } | null => {
  const attrMapEntry = DatabaseAttributes[attribute];
  if (!attrMapEntry) return null;

  if (!attrMapEntry.linkedTables && !isChild && !getAttribute) {
    return { table: attrMapEntry.table, query: "*" };
  }

  let query = !isChild || attrMapEntry.linkedTables ? "*," : "";
  if (!isChild && getAttribute) {
    query = `${attribute}:${attrMapEntry.table} (*${
      attrMapEntry.linkedTables ? "," : ""
    }`;
  }

  if (attrMapEntry.linkedTables) {
    query += attrMapEntry.linkedTables.map((lkTable) => {
      const fetchedChild = createQueryFromAttributesTables(lkTable, true);
      return fetchedChild
        ? ` ${lkTable}:${fetchedChild.table} (${fetchedChild.query})`
        : "";
    }).filter(Boolean);
  }

  if (!isChild && getAttribute) query += ")";
  if (!attrMapEntry.linkedTables && isChild) query += "*";

  return query ? { table: attrMapEntry.table, query: query } : null;
};
