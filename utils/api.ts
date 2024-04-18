import { PostgrestError } from "https://esm.sh/v135/@supabase/postgrest-js@1.15.2/dist/module/index.js";

/**
 * Throw an bad response if there is an error or the data is empty.
 * 
 * Also logs the error if there is one.
 * 
 * @param {any} data - The data to be checked.
 * @param {Error} error - The error to be checked.
 * @returns {Response | null} A response object with the error message or null if the data is not empty.
 */
export const evaluateSupabaseResponse = (data: any, error: Error | PostgrestError | null): Response | null => {
  if (error) {
    console.error("=========Error while fetching data=========\n", error);
    return new Response("Server error", { status: 500 });
  }

  if (!data || data.length === 0) {
    return new Response(null, { status: 204 });
  }

  return null;
}