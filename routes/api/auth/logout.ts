import { setAuthCookie } from "@services/supabase.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;
    const res = new Response();
    await setAuthCookie(res, "", "");
    return res;
  },
});
