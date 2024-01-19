import { Handlers } from "$fresh/server.ts";
import { UserAdminActions } from "@models/User.ts";
import { updateUserMetadata } from "@services/supabase.ts";

export const handler: Handlers<any | null> = {
  async PUT(req, ctx) {
    const id = ctx.params.id;
    const body = await req.json();
    const action: UserAdminActions = body.action;

    let res

    if (action === "block" || action === "unblock") res = await updateUserMetadata(id, { is_authorised: action === "unblock" ? true : false });
    return new Response(JSON.stringify(res.data), { status: 200 });
  },
};
