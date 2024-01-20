import { FreshContext, Handlers } from "$fresh/server.ts";
import { setAuthCookie } from "@services/supabase.ts";

export const handler: Handlers<any | null> = {
  async POST(req: Request, ctx: FreshContext) {
    const res = new Response()
    await setAuthCookie(res, "", "")
    return res
  },
};
