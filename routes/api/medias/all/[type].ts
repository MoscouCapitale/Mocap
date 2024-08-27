import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { Media, MediaType } from "@models/Medias.ts";
import { evaluateSupabaseResponse, returnErrorReponse } from "@utils/api.ts";
import { FileObject } from "https://esm.sh/v135/@supabase/storage-js@2.5.5/dist/module/index.js";

// TODO: why is array sometime empty?
export const handler: Handlers<Media | null> = {
  /**
   * GET handler for retrieving all media of a specific type.
   * @param _req - The request object.
   * @param ctx - The context object containing the type parameter.
   * @returns A response object with the retrieved media or an error message.
   */
  async GET(_req, ctx) {
    const type: string = ctx.params.type;

    if (!Object.values(MediaType).includes(type as MediaType)) {
      return new Response(`${type} is not a valid type`, { status: 400 });
    }

    const { data, error } = await supa.storage
      .from(type)
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data?.length === 0) console.log(`No media found in bucket '${type}' at ${new Date().toISOString} -- (error: ${error})`)

      if (evaluateSupabaseResponse(data, error)) return returnErrorReponse(data, error);

    // @ts-ignore: media is never null
    const media: Promise<Media>[] = data!.map(async (item: FileObject) => {
      const mediaData = await getMediaInfosFromId(item.id);
      if (!mediaData[0]?.id) {
        const mediaInfos: Media = {
          id: item.id,
          name: item.name,
          display_name: item.name,
          public_src: supa.storage.from(type).getPublicUrl(item.name)
            .data.publicUrl,
          alt: item.name,
          type: type as MediaType,
          filesize: item.metadata.size,
          updated_at: new Date(item.updated_at).toISOString(),
          created_at: new Date(item.created_at).toISOString(),
          extension: item.metadata.mimetype,
        };
        await supa.from("Medias").insert([mediaInfos]);
        return mediaInfos;
      }
      return mediaData[0];
    });

    const resolvedMedia = await Promise.all(media);

    return new Response(JSON.stringify(resolvedMedia), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};

/**
 * Retrieves media information from the database based on the provided ID.
 * @param id - The ID of the media.
 * @returns A promise that resolves to an array of media information if successful, otherwise an empty array.
 */
const getMediaInfosFromId = async (id: string) => {
  const { data, error } = await supa.from("Medias").select(`*, cover (*), controls (*), cta (*), object_fit (*)`).eq("id", id);
  if (error) return [];
  return data;
};
