import { supabase as sup } from "@services/supabase.ts";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Role } from "@models/User.ts";
import UsersList from "@islands/Settings/Users/UsersList.tsx";

// TODO: add types
export const handler: Handlers<any> = {
  async GET(req: Request, ctx: FreshContext) {
    let users = await sup.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    users = users?.data?.users
    const roles: Role[] = ["anon", "authenticated", "mocap_admin", "supabase_admin"];
    const currentUser = ctx.state.user;

    return ctx.render({ users, currentUser, roles });
  },
  async POST(req: Request, ctx: FreshContext) {
    const modifiedUsers = await req.json();
    const currentUsers = await sup.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    return ctx.render({});
  },
};

export default function Users({ data }: PageProps<any>) {
  const { users, currentUser, roles } = data;
  return <UsersList users={users} currentUser={currentUser} roles={roles} />;
}
