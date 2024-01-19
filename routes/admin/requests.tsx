import { supabase as sup, updateAuthorizations } from "@services/supabase.ts";
import { FreshContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import RequestSingle from "@islands/Users/RequestSingle.tsx";

import { User } from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import { RequestedUser, Role } from "@models/User.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export const handler: Handlers<User | null> = {
  async GET(req: Request, ctx: FreshContext) {
    const res = await sup.from("Users").select().eq("requested", true).eq("accepted", false);
    let userRequests = res.data;

    userRequests = await Promise.all(
      userRequests.map(async (user: RequestedUser) => {
        const userInfos = await sup.auth.admin.getUserById(user.id);
        return { ...user, email: userInfos.data.user.email, created_at: userInfos.data.user.created_at, role: userInfos.data.user.role };
      })
    );

    return ctx.render({ userRequests });
  },

  async POST(req, _ctx) {
    const user: RequestedUser = await req.json();
    const res = await sup.from("Users").update({ requested: false, accepted: true }).eq("id", user.id);
    const res_role = await sup.auth.admin.updateUserById(user.id, { role: user.role });
    updateAuthorizations(user);
    return new Response(res.error || res_role.error ? JSON.stringify({ request_update: res.error, role_update: res.error }) : "true");
  },

  async PUT(req, _ctx) {
    const user: RequestedUser = await req.json();
    const res = await sup.from("Users").update({ requested: false, accepted: false }).eq("id", user.id);
    return new Response(res.error ? JSON.stringify(res.error) : "true");
  },
};

export default function Requests({ data }: PageProps<Record<string, RequestedUser[]>>) {
  const { userRequests } = data;

  return (
    <main className={"w-full min-h-screen justify-center items-center gap-[150px] inline-flex"}>
      {userRequests.length === 0 && <div class="text-text text-base font-bold">Aucune demande d'inscription</div>}
      {userRequests.length > 0 &&
        userRequests.map((user: RequestedUser) => {
          return <RequestSingle {...user} />;
        })}
    </main>
  );
}
