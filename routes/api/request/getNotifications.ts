import { supabase as supa } from "@services/supabase.ts";
import { define } from "@utils/app.ts";

export const handler = define.handlers<number>({
  GET: async () => {
    const { data: users } = await supa.from("Users").select().eq("requested", true).eq("accepted", false);
    const usersNb = users.length;
    return new Response(usersNb ? JSON.stringify(usersNb) : null, { status: usersNb ? 200 : 204 });
  },
});
