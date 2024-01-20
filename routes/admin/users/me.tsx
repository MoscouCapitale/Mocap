import { Handlers } from "$fresh/server.ts";
import { UserAdminActions } from "@models/User.ts";
import { supabase as supa, updateUserMetadata } from "@services/supabase.ts";

export const handler: Handlers<any | null> = {
  async GET(req, ctx) {
    // TODO: proper api endpoint, why is ctx.state.user null?
    return new Response(JSON.stringify(ctx.state.user), { status: 200 });
  },
};
