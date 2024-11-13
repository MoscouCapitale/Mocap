import { Handlers } from "$fresh/server.ts";
import { supabase, supabase as supa } from "@services/supabase.ts";
import { isUUIDValid } from "@utils/database.ts";
import { Media } from "@models/Medias.ts";
import { Image } from "@models/Medias.ts";
import { Database } from "@models/database.ts";

export const handler: Handlers<Media | null> = {
  /**
   * GET handler for retrieving all media of a specific type.
   * @param _req - The request object.
   * @param ctx - The context object containing the type parameter.
   * @returns A response object with the retrieved media or an error message.
   */
  async PUT(_req, ctx) {
    const id: string = ctx.params.id;
    if (!isUUIDValid(id)) return new Response("Bad request", { status: 400 });

    const body = await _req.json();

    console.log("Received body for update:", body);

    const modifiedMedia: Partial<Database['public']['Tables']['Medias']['Row']> = {
      display_name: body.display_name,
      alt: body.alt,
      object_fit: body.object_fit,
      cta: body.cta?.id ?? null,
      autoplay: body.autoplay ?? false,
      autodetect_source: body.autodetect_sources ?? false,
    };

    const { data, error } = await supa.from("Medias").update(modifiedMedia).eq(
      "id",
      id,
    ).select();

    if (error || !data) {
      console.error("Error while updating media:\n", error);
      return new Response("Server error", { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  },

  async DELETE(_req, ctx) {
    const id: string = ctx.params.id;
    if (!isUUIDValid(id)) return new Response("Bad request", { status: 400 });

    const { data: fetchedMedia, error: fetchedError } = await supabase.from(
      "Medias",
    ).select().eq("id", id).select();

    if (fetchedError) {
      return new Response("Error while fetching data", { status: 500 });
    }

    if (fetchedMedia?.length === 0) {
      return new Response(null, { status: 204 });
    }

    const media: Media = fetchedMedia[0] as Media;

    const { error: delError } = await supabase
      .storage
      .from(media.type)
      .remove([media.name]);

    if (delError) {
      return new Response("Error while fetching data", { status: 500 });
    }

    const { error: delTableError } = await supabase.from('Medias').delete().eq('id', id)

    if (delTableError) {
        return new Response("Error while fetching data", { status: 500 });
    }

    return new Response(null, { status: 200 });
  },
};
