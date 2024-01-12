import { Role } from "@models/User.ts";
import { useEffect, useState } from "preact/hooks";

export default function UsersList(props: { users: any; currentUser: any; roles: Role[] }) {
  const [usersList, setUsersList] = useState(props.users);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (usersList !== props.users) setIsModified(true);
  }, [usersList]);

  return (
    <main className={"p-10 w-full"}>
      <table class="w-full border-spacing-12">
        <thead className={"border-spacing-5"}>
          <tr>
            <th class="text-left">Email</th>
            <th class="text-left">R&ocirc;le</th>
            <th class="text-left">Date de cr&eacute;ation</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          {usersList.map((user: any) => (
            <tr className={`${currentUser.id === user.id ? "text-text_grey" : "text-text"}`}>
              <td className={"text-inherit"}>{user.email}</td>
              <td>
                {/* TODO: proper select component */}
                {currentUser.id === user.id && <p>{currentUser.role}</p>}
                {currentUser.id !== user.id && (
                  <select
                    class="bg-background rounded-[5px] px-2 py-[5px] text-text_grey text-base font-semibold"
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
              </td>
              <td>{user.created_at.split("T")[0]}</td>
              <td class="">
                <button className={"justify-end items-start gap-[3px] inline-flex"}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span className={`block w-2 h-2 bg-background rounded-full border-2 border-text`}></span>
                  ))}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
