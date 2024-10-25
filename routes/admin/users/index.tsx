import UsersList from "@islands/Users/UsersList.tsx";
import ContextualDots from "@islands/UI/ContextualDots.tsx";
import UserActions from "@islands/Settings/Users/UsersList/UserActions.tsx";
import { Tooltip } from "@islands/UI/Tooltip.tsx";
import { UserAdminActions } from "@models/User.ts";
import { RouteContext } from "$fresh/server.ts";
import { User } from "@models/Authentication.ts";
import { supabase as supa, updateUserMetadata } from "@services/supabase.ts";

export default async function Users(req: Request, ctx: RouteContext) {
  // Current user cannot be null, because it is checked in the middleware
  const currentUser = ctx.state.user;

  const { data, error } = await supa.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const usersList = data?.users;

  return <UsersList currentUser={currentUser as User} usersList={usersList as User[]} />;
}
