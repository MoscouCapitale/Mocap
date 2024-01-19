import { Role, UserAdminActions } from "@models/User.ts";
import { useEffect, useState } from "preact/hooks";
import ConfirmationModal from "@islands/ConfirmationModal.tsx";

import { Info } from "lucide-icons";
import UserActions from "@islands/Settings/Users/UsersList/UserActions.tsx";

export default function UsersList(props: { users: any; currentUser: any; roles: Role[] }) {
  const [usersList, setUsersList] = useState(props.users);
  const [showContextualMenu, setShowContextualMenu] = useState<string>("");
  const currentUser = props.currentUser;

  useEffect(() => {
    console.log("user list", usersList);
  }, [usersList]);

  const updateUserAccess = async (user: any, action: UserAdminActions) => {
    setShowContextualMenu("");
    const res = await fetch(`/admin/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ action: action }),
    });
    const body = await res.json();
    setUsersList(usersList.map((u: any) => (u.id === body.user.id ? body.user : u)));
  };

  return (
    <main className={"p-10 flex-col justify-start items-start gap-5 inline-flex w-full max-w-7xl"}>
      <div className={"w-full justify-start items-center gap-[50px] inline-flex text-text_grey"}>
        <div class="text-left grow max-w-[250px]">Email</div>
        <div class="text-left grow max-w-[200px]">R&ocirc;le</div>
        <div class="text-left grow max-w-[200px]">Date de cr&eacute;ation</div>
        {/* <div class="text-left grow"></div> */}
      </div>
      <div className={"w-full flex-col justify-center items-start gap-10 inline-flex"}>
        {Array.from(usersList).map((user: any) => (
          <div className={`w-full justify-start items-center gap-[50px] inline-flex ${currentUser.id === user.id ? "text-text_grey" : "text-text"}`}>
            <div className={"grow max-w-[250px] whitespace-nowrap overflow-hidden overflow-ellipsis"}>
              {user.email}
              {/* TODO: set hint on hover */}
              {currentUser.id === user.id && <Info className={"ml-2 inline"} size={14} />}
            </div>
            <div className={"grow max-w-[200px]"}>
              {/* TODO: proper select component */}
              {currentUser.id === user.id && currentUser.role}
              {currentUser.id !== user.id && (
                <select
                  class="bg-background rounded-[5px] text-text text-base font-semibold"
                  value={user.role}
                  onChange={(e) =>
                    setUsersList({
                      ...usersList,
                      [user.id]: { ...user, role: (e.target as HTMLSelectElement).value ? ((e.target as HTMLSelectElement).value as Role) : "anon" },
                    })
                  }
                >
                  {props.roles.map((role) => (
                    <option selected={role === user.role}>{role}</option>
                  ))}
                </select>
              )}
            </div>
            <div className={"grow max-w-[200px]"}>{user.created_at.split("T")[0]}</div>
            <div className={"grow h-full justify-end inline-flex relative"}>
              <button
                className={"h-full justify-end items-start gap-[3px] inline-flex"}
                onClick={() => setShowContextualMenu(showContextualMenu === user.id ? "" : user.id)}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <span className={`block w-2 h-2 bg-background rounded-full border-2 border-text`}></span>
                ))}
              </button>
              {showContextualMenu === user.id && (
                <UserActions
                  user={user}
                  onBlockUnblock={(action: UserAdminActions) => updateUserAccess(user, action)}
                  onRevoke={() => updateUserAccess(user, "revoke")}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
