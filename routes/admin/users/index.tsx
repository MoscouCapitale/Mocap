import { RouteContext } from "$fresh/server.ts";
import Button from "../../../islands/UI/Button.tsx";
import { Tooltip } from "@islands/UI";
import UsersList from "@islands/Users/UsersList.tsx";
import { User, UserStatus } from "@models/Authentication.ts";
import { supabase as supa } from "@services/supabase.ts";
import { cn } from "@utils/cn.ts";
import { IconChevronLeft, IconChevronRight } from "@utils/icons.ts";

const displayUserStatuses = [
  UserStatus.ACTV,
  UserStatus.BLCK,
  UserStatus.BANN,
];

export default async function Users(req: Request, ctx: RouteContext) {
  // Current user cannot be null, because it is checked in the middleware
  const currentUser = ctx.state.user;

  const displayAllUsers = new URL(ctx.url.href).searchParams.get("status") === "all";
  const currentPage = new URL(ctx.url.href).searchParams.get("page") || "1";

  const { data } = await supa.auth.admin.listUsers({
    page: parseInt(currentPage),
  });

  const pagination = {
    // @ts-ignore - The Pagination type is not correctly defined by Supabase
    total: data?.total ?? 0,
    // @ts-ignore - The Pagination type is not correctly defined by Supabase
    hasPrevious: data?.lastPage > 1 && data?.currentPage > 1,
    // @ts-ignore - The Pagination type is not correctly defined
    hasNext: data?.nextPage !== null,
  };

  // Get only the users with the statuses we want to display (for the requested users, check the request page)
  const usersList = displayAllUsers
    ? data?.users as User[]
    : (data?.users as User[]).filter((user) => displayUserStatuses.includes(user.user_metadata.status));

  return (
    <>
      <UsersList currentUser={currentUser as User} usersList={usersList as User[]} />;

      <footer class="w-full flex align-center justify-end -mt-7 gap-3">
        {/* Display all users or only active users */}
        <Tooltip text='Par défaut, seuls les utilisateurs actifs sont affichés. Pour voir les utilisateurs en attente de validation, voir la page "Requêtes".' />
        <Button
          variant={displayAllUsers ? "secondary" : "primary"}
        >
          <a href={`?status=${displayAllUsers ? "active" : "all"}&page=${currentPage}`}>
            {displayAllUsers ? "Voir utilisateurs actifs" : "Voir tous les utilisateurs"}
          </a>
        </Button>

        {/* Simple pagination */}
        <div class="flex align-center justify-center gap-2">
          <a
            href={`?status=${displayAllUsers ? "all" : "active"}&page=${
              pagination.hasPrevious ? parseInt(currentPage) - 1 : currentPage
            }`}
            class={cn(
              pagination.hasPrevious ? "opacity-100" : "opacity-50 pointer-events-none",
            )}
          >
            <IconChevronLeft class="text-text" />
          </a>
          <p>{currentPage}</p>
          <a
            href={`?status=${displayAllUsers ? "all" : "active"}&page=${
              pagination.hasNext ? parseInt(currentPage) + 1 : currentPage
            }`}
            class={cn(
              pagination.hasNext ? "opacity-100" : "opacity-50 pointer-events-none",
            )}
          >
            <IconChevronRight class="text-text" />
          </a>
        </div>
      </footer>
    </>
  );
}
