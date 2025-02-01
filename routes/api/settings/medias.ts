import { Handlers } from "$fresh/server.ts";
import { getCachedSettings } from "../../../stores/settings.ts";

export const handler: Handlers<ReturnType<typeof getCachedSettings> | null> = {
  async GET() {
    const medias = await getCachedSettings("medias") ?? {};
    return new Response(JSON.stringify(medias), { status: 200 });
  },
};
