import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { Media } from "@models/Medias.ts";

const acceptableTypes = ["photos", "videos", "misc"];

const associatedBucket: { [key: string]: string } = {
  photos: "Images",
  videos: "Videos",
  misc: "Misc",
};

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
    if (!acceptableTypes.includes(type)) {
      return new Response("Invalid type", { status: 400 });
    }
    const { data, error } = await supa.storage
      .from(associatedBucket[type])
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      return new Response("Error while fetching data", { status: 500 });
    }
    const media: Media[] = data.map((item: any) => {
      let mediaInfos: Media = {
        id: item.id,
        name: item.name,
        display_name: item.name,
        public_src:
          supa.storage.from(associatedBucket[type]).getPublicUrl(item.name)
            .data.publicUrl,
        alt: item.name,
      };
      getMediaInfosFromId(item.id).then((data: any[]) => {
        mediaInfos = data[0];
      });
      if (!mediaInfos) supa.from("Medias").insert([mediaInfos]);
      return mediaInfos;
    });

    return new Response(JSON.stringify(media), {
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
  const { data, error } = await supa.from("Medias").select("*").eq("id", id);
  if (error) return [];
  return data;
};
