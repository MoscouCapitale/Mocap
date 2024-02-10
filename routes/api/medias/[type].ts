import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { Media } from "@models/Medias.ts";

const acceptableTypes = ["photos", "videos", "misc"];

const associatedBucket: { [key: string]: string } = {
  photos: "Images",
  videos: "Videos",
  misc: "Misc",
};

// TODO: change any to global media type
export const handler: Handlers<Media | null> = {
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
      return {
        src:
          supa.storage.from(associatedBucket[type]).getPublicUrl(item.name).data
            .publicUrl,
        type: type,
        alt: item.name,
      };
    });

    return new Response(JSON.stringify(media), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
