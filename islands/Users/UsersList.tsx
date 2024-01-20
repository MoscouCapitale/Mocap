import { Role, UserAdminActions } from "@models/User.ts";
import { useEffect, useState } from "preact/hooks";
import { IconInfoSquareRounded } from "@utils/icons.ts";
import UserActions from "@islands/Settings/Users/UsersList/UserActions.tsx";

export default function UsersList() {
  const roles: Role[] = ["anon", "authenticated", "mocap_admin", "supabase_admin"];
  const [usersList, setUsersList] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showContextualMenu, setShowContextualMenu] = useState<string>("");

  useEffect(() => {
    if (!usersList) updateUsersList();
  }, [usersList]);

  useEffect(() => {
    if (!currentUser)
      // TODO: proper api endpoint fetcher
      fetch("/admin/users/me")
        .then((res) => res.json())
        .then((user) => setCurrentUser(user));
  }, [currentUser]);

  useEffect(() => {
    console.log(usersList);
    console.log(currentUser);
  }, [usersList, currentUser]);

  const updateUsersList = async () => {
    const res = await fetch("/api/users/all");
    const users = await res.json();
    setUsersList(users);
  };

  const updateUserAccess = async (user: any, action: UserAdminActions) => {
    setShowContextualMenu("");
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ action: action }),
    });
    updateUsersList();
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
        {!usersList && <div className={"text-text_grey"}>Chargement...</div>}
        {usersList &&
          currentUser &&
          Array.from(usersList).map((user: any) => (
            <div className={`w-full justify-start items-center gap-[50px] inline-flex ${currentUser.id === user.id ? "text-text_grey" : "text-text"}`}>
              <div className={"grow max-w-[250px] whitespace-nowrap overflow-hidden overflow-ellipsis"}>
                {user.email}
                {/* TODO: set hint on hover */}
                {currentUser.id === user.id && <IconInfoSquareRounded className={"ml-2 inline w-[16px] h-[16px]"} />}
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
                    {roles.map((role) => (
                      <option selected={role === user.role}>{role}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className={"grow max-w-[200px]"}>{user.created_at.split("T")[0]}</div>
              <div className={"grow h-full justify-end inline-flex relative"}>
                {currentUser.id !== user.id && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
