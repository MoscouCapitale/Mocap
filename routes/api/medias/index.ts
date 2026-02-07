import { Media } from "@models/Medias.ts";
import { supabase as supa } from "@services/supabase.ts";
import { define } from "@utils/app.ts";
import { getMediaTypeFromFiletype, validateObjectForDB } from "@utils/database.ts";

export const handler = define.handlers<Media | null>({
  /**
   * GET handler for retrieving all media of a specific type.
   * @param _req - The request object.
   * @param ctx - The context object containing the type parameter.
   * @returns A response object with the retrieved media or an error message.
   */
  async POST(ctx) {
    const formData = await ctx.req.formData();

    const file = formData.get("file") as File;

    const bucket = getMediaTypeFromFiletype(file.type);

    if (!bucket) return new Response("Unsupported Media Type", { status: 415 });

    const { error } = await supa
      .storage
      .from(bucket)
      .upload(validateObjectForDB(file.name), file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error while uploading media:\n", error);
      return new Response("Server error", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  },
});
