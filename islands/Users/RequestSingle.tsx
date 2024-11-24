import RequestButton from "@islands/Users/RequestButton.tsx";
import { useMemo, useState } from "preact/hooks";
import { User, UserRole, UserStatus } from "@models/Authentication.ts";
import { FormField } from "@models/Form.ts";
import { Select } from "@islands/UI";
import { Toaster } from "@components/UI/Toast/Toaster.tsx";
import { toast } from "@hooks/toast.tsx";

export default function RequestSingle(user: User) {
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [loading, setLoading] = useState(false);

  const selectField: FormField = useMemo(() => ({
    name: "role",
    type: "select",
    defaultValue: user.user_metadata.role ?? UserRole.USER,
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
  }), [user]);

  const handleRequest = (accept: boolean) => {
    setLoading(true);
    fetch(`/api/users/manage/${user.id}/request`, {
      method: "PUT",
      body: JSON.stringify({ user: { role: currentUser?.role, status: accept ? UserStatus.ACTV : UserStatus.DECL } }),
    }).then((res) => {
      if (res.status === 200) {
        setCurrentUser(null);
        toast({
          description: `L'utilisateur a bien été ${accept ? "accepté" : "refusé"}`,
        });
      } else {
        toast({
          title: "Erreur lors de la mise à jour de l'utilisateur",
          description: res.status === 401
            ? "Vous n'avez pas les droits pour effectuer cette action"
            : "Erreur serveur, veuillez réessayer plus tard",
        });
      }
    }).catch(
      (e) => {
        console.error("Error updating user role", e);
        toast({
          title: "Erreur lors de la mise à jour de l'utilisateur",
          description: "Erreur serveur, veuillez réessayer plus tard",
        });
      },
    );
    setLoading(false);
  };

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
                  <Select
                    error={null}
                    field={selectField}
                    onChange={(v) => setCurrentUser((p) => p ? { ...p, role: v } : null)}
                    min={1}
                  />
                </div>
              </div>
              <div class="self-stretch justify-start items-center gap-[20px] flex">
                <div
                  class={`px-2.5 py-[5px] bg-success rounded-[5px] flex-col justify-center items-start gap-2 inline-flex`}
                >
                  <button onClick={() => handleRequest(true)} class={`text-text text-base font-semibold`}>
                    {loading
                      ? <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-text_grey"></div>
                      : "Accepter"}
                  </button>
                </div>

                <div
                  class={`px-2.5 py-[5px] bg-error rounded-[5px] flex-col justify-center items-start gap-2 inline-flex`}
                >
                  <button onClick={() => handleRequest(false)} class={`text-text text-base font-semibold`}>
                    {loading
                      ? <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-text_grey"></div>
                      : "Refuser"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {user.created_at && <div class="text-text_grey text-xs font-normal">{user.created_at.split("T")[0]}</div>}
        </div>
      )}
      <Toaster />
    </>
  );
}
