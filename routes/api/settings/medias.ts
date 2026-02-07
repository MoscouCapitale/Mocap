import { define } from "@utils/app.ts";
import { getCachedSettings } from "../../../stores/settings.ts";

export const handler = define.handlers<ReturnType<typeof getCachedSettings> | null>({
  async GET() {
    const medias = await getCachedSettings("medias") ?? {};
    return new Response(JSON.stringify(medias), { status: 200 });
  },
});
