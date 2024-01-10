import { supabase as sup } from "@services/supabase.ts";
import { FreshContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { Database } from "@models/database.ts";

import { User } from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import { Role } from "@models/User.ts";

type RequestedUser = Database["public"]["Tables"]["Users"]["Row"] & { email?: string; created_at?: string };

const ROLES: Role[] = ["anon", "authenticated", "mocap_admin", "supabase_admin"];

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
        return { ...user, email: userInfos.data.user.email, created_at: userInfos.data.user.created_at };
      })
    );

    return ctx.render({ userRequests });
  },
};

export default function Requests({ data }: PageProps<Record<string, RequestedUser[]>>) {
  const { userRequests } = data;
  //console.log("user request", userRequests);
  return (
    <main className={"w-full min-h-screen justify-center items-center gap-[150px] inline-flex"}>
      {userRequests.map((user: RequestedUser) => {
        return (
          <div class="flex-col justify-center items-start gap-[5px] inline-flex">
            <div class="p-5 rounded-[10px] border border-text_grey flex-col justify-center items-start gap-5 flex">
              <div class="justify-start items-center gap-10 inline-flex">
                <div class="flex-col justify-center items-start gap-2 inline-flex">
                  <div class="text-text text-base font-bold">{user.email}</div>
                </div>
                <div class="flex-col justify-center items-start gap-2 inline-flex">
                  <div class="justify-start items-center gap-2.5 inline-flex">
                    <select class="bg-background rounded-[5px] px-2 py-[5px] text-text text-base font-semibold">
                      {ROLES.map((role: Role) => {
                        return <option value={role}>{role}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div class="self-stretch justify-start items-center gap-[30px] flex">
                  <button class="px-2.5 py-[5px] bg-success rounded-[5px] flex-col justify-center items-start gap-2 inline-flex">
                    <div class="text-text text-base font-semibold">Accepter</div>
                  </button>
                  <button class="px-2.5 py-[5px] bg-error rounded-[5px] flex-col justify-center items-start gap-2 inline-flex">
                    <div class="text-text text-base font-semibold">Refuser</div>
                  </button>
                </div>
              </div>
            </div>
            {user.created_at && <div class="text-text_grey text-xs font-normal">{user.created_at.split("T")[0]}</div>}
          </div>
        );
      })}
    </main>
  );
}
