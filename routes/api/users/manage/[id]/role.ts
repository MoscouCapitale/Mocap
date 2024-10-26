import { FreshContext, Handlers } from "$fresh/server.ts";
import { User, UserRole } from "@models/Authentication.ts";
import { supabase as supa, updateUserMetadata } from "@services/supabase.ts";

const adminRoles = [UserRole.ADMIN, UserRole.SADMIN];
const parsedRoles = Object.keys(UserRole).map((key) => UserRole[key as keyof typeof UserRole]);

export const handler: Handlers<User | null> = {
  /** Update the user role based on the role provided in the body.
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
    const body = await req.json();
    const newRole: UserRole = body.role;

    const { data, error } = await supa.auth.admin.getUserById(id);

    // If an error occurs or the user is not found, return a 404
    if (error || !data.user || !parsedRoles.includes(newRole)) return new Response(null, { status: 404 });

    // Superadmins cannot be modified by users with lower roles. Only superadmins can promote users to superadmins
    if (
      currentUser.user_metadata.role !== UserRole.SADMIN && data.user.user_metadata.role === UserRole.SADMIN ||
      currentUser.user_metadata.role !== UserRole.SADMIN && newRole === UserRole.SADMIN
    ) {
      console.error(`User ${currentUser.id} tried to update user ${id} to superadmin`);
      return new Response(null, { status: 401 });
    }

    const newUser = await updateUserMetadata(id, { role: newRole });
    return new Response(JSON.stringify(newUser), { status: 200 });
  },
};
