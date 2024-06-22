import { Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";

export const handler: Handlers<number> = {
  async GET() {
    const { data: users } = await supa.from("Users").select().eq("requested", true).eq("accepted", false);
    const usersNb = users.length;
    return new Response(usersNb ? JSON.stringify(usersNb) : null, { status: usersNb ? 200 : 204 });
  },
};
