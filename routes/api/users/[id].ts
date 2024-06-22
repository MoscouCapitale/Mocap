import { Handlers, FreshContext } from "$fresh/server.ts";
import { UserAdminActions } from "@models/User.ts";
import { supabase as supa, updateUserMetadata } from "@services/supabase.ts";

export const handler: Handlers<any | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const id = ctx.params.id;
    let user;

    if (id === "all") {
      const res = await supa.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });
      user = res?.data?.users;
    } else user = await supa.auth.admin.getUserById(id);
    return new Response(JSON.stringify(user), { status: 200 });
  },

  async PUT(req: Request, ctx: FreshContext) {
    const id = ctx.params.id;
    const body = await req.json();
    const action: UserAdminActions = body.action;

    let res;

    if (action === "block" || action === "unblock") {
      res = await updateUserMetadata(id, {
        is_authorised: action === "unblock" ? true : false,
      });
    }
    if (action === "revoke") res = await supa.auth.admin.deleteUser(id);
    return new Response(JSON.stringify(res?.data), { status: 200 });
  },
};
