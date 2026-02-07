import { getCachedSettings } from "../../../stores/settings.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers<ReturnType<typeof getCachedSettings> | null>({
  async GET() {
    const medias = await getCachedSettings("medias") ?? {};
    return new Response(JSON.stringify(medias), { status: 200 });
  },
});
