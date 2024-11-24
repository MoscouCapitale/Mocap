import UserActions from "@islands/Settings/Users/UsersList/UserActions.tsx";
import { Tooltip, ContextualDots, Select } from "@islands/UI";
import { User, UserRole, UserStatus } from "@models/Authentication.ts";
import { FormField } from "@models/Form.ts";
import { cn } from "@utils/cn.ts";
import { useEffect, useMemo, useState } from "preact/hooks";
import { Toaster } from "@components/UI/Toast/Toaster.tsx";
import { toast } from "@hooks/toast.tsx";

type UsersListProps = {
  currentUser: User;
  usersList: User[];
};

export default function UsersList({
  currentUser,
  usersList: propsUsersList,
}: UsersListProps) {
  // TODO: better user management, with a select to change the status exaclty like the role

  // Set the users list from the props, because when we update a user, we want to update the list accordingly
  const [usersList, setUsersList] = useState<User[] | null>(null);
  useEffect(() => setUsersList(propsUsersList), [propsUsersList]);

  const selectField: FormField = useMemo(() => ({
    name: "role",
    type: "select",
    options: [{
      label: "user",
      value: UserRole.USER,
    }, {
      label: "admin",
      value: UserRole.ADMIN,
    }, {
      label: "superadmin",
      value: UserRole.SADMIN,
    }],
  }), [currentUser]);

  // TODO: regorup both the updateUserRole and updateUserAccess into one function

  /**
   * Update the user status
   *
   * @param {User} user - The user to update
   * @param {UserStatus} status - The new status to apply
   * @throws {Error} If the request fails, display a toast with the error message. If 401, user doesn't have the rights.
   */
  const updateUserAccess = (user: User, status: UserStatus) => {
    fetch(`/api/users/manage/${user.id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }).then(async (res) => {
      if (res.ok) return res ? await res.json() : null;
      toast({
        title: "Erreur lors de la mise à jour de l'utilisateur",
        description: res.status === 401
          ? "Vous n'avez pas les droits pour effectuer cette action"
          : "Erreur serveur, veuillez réessayer plus tard",
      });
    }).then((newUser: User | null) => {
      setUsersList((prev) => {
        console.log("prev", prev, "newUser", newUser);
        if (!prev) return null;
        if (!newUser) return prev.filter((u) => u.id !== user.id);
        return prev.map((u) => (u.id === newUser.id ? newUser : u));
      });
      toast({
        description: "L'utilisateur a été mis à jour avec succès",
      });
    }).catch(
      (e) => {
        console.error("Error updating user access", e);
        toast({
          title: "Erreur lors de la mise à jour de l'utilisateur",
          description: "Erreur serveur, veuillez réessayer plus tard",
        });
      },
    );
  };

  const updateUserRole = (user: User, role: string) => {
    fetch(`/api/users/manage/${user.id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }).then(async (res) => {
      if (res.status === 200) return res ? await res.json() : null;
      toast({
        title: "Erreur lors de la mise à jour de l'utilisateur",
        description: res.status === 401
          ? "Vous n'avez pas les droits pour effectuer cette action"
          : "Erreur serveur, veuillez réessayer plus tard",
      });
    }).then((newUser: User | null ) => {
      setUsersList((prev) => {
        console.log("prev", prev, "newUser", newUser);
        if (!prev) return null;
        if (!newUser) return prev;
        return prev.map((u) => (u.id === newUser.id ? newUser : u));
      });
      toast({
        description: "L'utilisateur a été mis à jour avec succès",
      });
    }).catch(
      (e) => {
        console.error("Error updating user role", e);
        toast({
          title: "Erreur lors de la mise à jour de l'utilisateur",
          description: "Erreur serveur, veuillez réessayer plus tard",
        });
      },
    );
  };

  const cellSpacing = "px-6 py-3 h-full";

  return (
    <main className={"justify-start items-start inline-flex w-full max-w-7xl"}>
      <table className="min-w-full text-left whitespace-nowrap overflow-x-auto">
        <thead class="sticky">
          <tr>
            <th scope="col" className={cn(cellSpacing)}>Email</th>
            <th scope="col" className={cn(cellSpacing)}>R&ocirc;le</th>
            <th scope="col" className={cn(cellSpacing)}>Date de cr&eacute;ation</th>
            <th scope="col" className={cn(cellSpacing, "text-right")}></th>
          </tr>
        </thead>
        <tbody>
          {usersList &&
            currentUser &&
            Array.from(usersList).map((user) => (
              <tr
                className={cn(
                  // `w-full justify-start items-center gap-[50px] inline-flex`,
                  "hover:bg-[#FFFFFF08] transition-all ease-in-out",
                  currentUser.id === user.id && "opacity-50",
                )}
                style={{ clipPath: "xywh(0 0 100% 100% round 0.5em)" }}
              >
                <td className={cn(cellSpacing)}>
                  <div className={"flex items-center gap-2"}>
                    <p className={"truncate"}>{user.email}</p>
                    {currentUser.id === user.id && (
                      <Tooltip
                        text={"Utilisateur actuellement connecté"}
                        Icon={"no-border"}
                      />
                    )}
                  </div>
                </td>
                <td className={cn(cellSpacing, "")}>
                  {currentUser.id === user.id ? currentUser.user_metadata.role : (
                    <Select
                      error={null}
                      field={{...selectField, defaultValue: user.user_metadata.role}}
                      onChange={(v) => updateUserRole(user, v)}
                      min={1}
                    />
                  )}
                </td>
                <td className={cn(cellSpacing)}>
                  <p className={"truncate"}>{new Date(user.created_at).toLocaleDateString()}</p>
                </td>
                <td className={cn(cellSpacing)}>
                  <div className={"justify-end inline-flex relative"}>
                    {currentUser.id !== user.id && (
                      <ContextualDots
                        popoverChildren={
                          <UserActions
                            user={user}
                            onChangeStatus={(status: UserStatus) => updateUserAccess(user, status)}
                          />
                        }
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Toaster />
    </main>
  );
}
