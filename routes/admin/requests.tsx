import { RouteContext } from "$fresh/server.ts";
import RequestSingle from "@islands/Users/RequestSingle.tsx";
import { supabase as supa } from "@services/supabase.ts";

import { User, UserStatus } from "@models/Authentication.ts";

export default async function Requests(req: Request, ctx: RouteContext) {
  const { data } = await supa.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const userRequests = (data.users as User[]).filter((user) =>
    user.user_metadata.status === UserStatus.RQST &&
    user.id !== (ctx.state.user as User).id
  );

  return (
    <main className={"w-full min-h-full justify-center items-center gap-[150px] inline-flex"}>
      {userRequests.length === 0
        ? <div class="text-text text-base font-bold">Aucune demande d'inscription</div>
        : userRequests.map((user: User) => <RequestSingle {...user} />)}
    </main>
  );
}
