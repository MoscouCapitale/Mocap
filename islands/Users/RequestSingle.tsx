import { RequestedUser, Role } from "@models/User.ts";

import RequestButton from "@islands/Users/RequestButton.tsx";
import { useEffect, useState } from "preact/hooks";

const ROLES: Role[] = ["anon", "authenticated", "mocap_admin", "supabase_admin"];

export default function RequestSingle(user: RequestedUser) {
  const [currentUser, setCurrentUser] = useState<RequestedUser>(user);

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

  return (
    <>
      {user && (
        <div class="flex-col justify-center items-start gap-[5px] inline-flex">
          <div class="p-5 rounded-[10px] border border-text_grey flex-col justify-center items-start gap-5 flex">
            <div class="justify-start items-center gap-10 inline-flex">
              <div class="flex-col justify-center items-start gap-2 inline-flex">
                <div class="text-text text-base font-bold">{user.email}</div>
              </div>
              <div class="flex-col justify-center items-start gap-2 inline-flex">
                <div class="justify-start items-center gap-2.5 inline-flex">
                  <select
                    class="bg-background rounded-[5px] px-2 py-[5px] text-text_grey text-base font-semibold"
                    value={currentUser.role}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, role: (e.target as HTMLSelectElement).value ? ((e.target as HTMLSelectElement).value as Role) : "anon" })
                    }
                  >
                    {ROLES.map((role: Role) => {
                      return <option value={role}>{role === "anon" ? "anon (default)" : role}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div class="self-stretch justify-start items-center gap-[20px] flex">
                <RequestButton user={currentUser} text={"Accepter"} accept={true} />
                <RequestButton user={currentUser} text={"Refuser"} accept={false} />
              </div>
            </div>
          </div>
          {user.created_at && <div class="text-text_grey text-xs font-normal">{user.created_at.split("T")[0]}</div>}
        </div>
      )}
    </>
  );
}
