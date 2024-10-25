import { getUserFromSession } from "@services/supabase.ts";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

import UserChangePassword from "@components/settings/UserChangePassword.tsx";
import UserRevokeAccount from "@components/settings/UserRevokeAccount.tsx";

import { User } from "@models/Authentication.ts";

export const handler: Handlers<User | null> = {
  async GET(req: Request, ctx: FreshContext) {
    let user = ctx.state.user;
    if (!user) {
      const { user: res } = await getUserFromSession(req);
      user = res;
    }
    return ctx.render({ user });
  },

  async POST(req, _ctx) {
    return new Response("Not implemented", { status: 501 });
  },

  async PUT(req, _ctx) {
    return new Response("Not implemented", { status: 501 });
  },
};

export default function UserSettings({ data }: PageProps<any>) {
  const { user } = data;
  if (!user) return <div className={"text-text"} >Not logged in</div>;
  return (
    <div className={"flex-col justify-center items-start inline-flex gap-[50px]"}>
      <div className="justify-center items-center gap-10 inline-flex">
        <div className="text-text">Adresse mail</div>
        <div className="text-text_grey">{user.email}</div>
      </div>
      <UserChangePassword {...user} />
      <UserRevokeAccount {...user} />
    </div>
  );
}
