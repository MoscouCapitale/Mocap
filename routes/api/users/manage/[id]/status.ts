import { FreshContext, Handlers } from "$fresh/server.ts";
import { User, UserRole, UserStatus } from "@models/Authentication.ts";
import { supabase as supa, updateUserMetadata } from "@services/supabase.ts";

const adminRoles = [UserRole.ADMIN, UserRole.SADMIN];

export const handler: Handlers<User | null> = {
  /** Update the user status based on the action provided in the body.
   *
   * @param req
   * @param ctx
   * @returns - The updated user object.
   */
  async PUT(req: Request, ctx: FreshContext) {
    const currentUser = ctx.state.user as User;

    // If no user is currently logged in or the user is not an admin, return a 401
    if (!currentUser || !adminRoles.includes(currentUser.user_metadata.role) || currentUser.id === ctx.params.id) {
      return new Response(null, { status: 401 });
    }

    const id = ctx.params.id;

    const { data, error } = await supa.auth.admin.getUserById(id);

    // If an error occurs or the user is not found, return a 404
    if (error || !data.user) return new Response(null, { status: 404 });

    // Superadmins cannot be modified by users with lower roles
    if (data.user.user_metadata.role === UserRole.SADMIN && currentUser.user_metadata.role !== UserRole.SADMIN) {
      return new Response(null, { status: 401 });
    }

    const body = await req.json();
    const status: UserStatus = body.status;

    // On user revoke, delete the user
    if (status === UserStatus.BANN) {
      const { data } = await supa.auth.admin.deleteUser(id);
      return new Response(JSON.stringify(data.user), { status: 200 });
    }

    const newUser = await updateUserMetadata(id, { status });
    return new Response(JSON.stringify(newUser), { status: 200 });
  },
};
