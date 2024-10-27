import { Handlers, RouteContext } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";

import UserRevokeAccount from "@components/settings/UserRevokeAccount.tsx";

import { ToasterToast } from "@hooks/toast.tsx";
import ToasterWrapper from "@islands/UI/ToasterWrapper.tsx";
import { User } from "@models/Authentication.ts";
import { verifyEmailIntegrity } from "@utils/login.ts";

type HandlerType = {
  toast: Omit<ToasterToast, "id"> | null;
} | Record<string | number | symbol, never>;

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const url = new URL(req.url);
    const user = ctx.state.user as User;

    if (!user) return ctx.render({});

    const form = await req.formData();

    const formData = {
      action: form.get("action")?.toString() || "",
      email: form.get("email")?.toString() || "",
      newEmail: form.get("newEmail")?.toString() || "",
    };

    console.log("formData: ", formData);

    if (formData.action === "changeEmail") {
      if (verifyEmailIntegrity(formData.newEmail) !== "") {
        return ctx.render({
          toast: {
            title: "Erreur lors du changement d'adresse mail",
            description: "L'adresse mail n'est pas valide",
          },
        });
      }

      const { data, error } = await supa.auth.admin.generateLink({
        type: "email_change_new",
        email: formData.email,
        newEmail: formData.newEmail,
        options: {
          // Redirect to the callback page with the current URL as a redirect
          redirectTo: `${url.origin}/auth/callback?redirect=${url.pathname}`,
        },
      });

      console.dir({ data, error }, { depth: null });

      if (error || !data.properties?.action_link) {
        return ctx.render({
          toast: {
            title: "Erreur lors du changement d'adresse mail",
            description:
              "Une erreur est survenue lors de la génération du lien de confirmation. Merci de réessayer ultérieurement.",
          },
        });
      }
      return new Response("", {
        status: 301,
        headers: { Location: data.properties.action_link },
      });
    }

    if (formData.action === "revoke") {
      const { error } = await supa.auth.admin.deleteUser(user.id);
      if (!error) {
        return new Response("", {
          status: 301,
          headers: { Location: "/" },
        });
      } else {
        return ctx.render({
          toast: {
            title: "Erreur lors de la révocation du compte",
            description:
              "Une erreur est survenue lors de la révocation de votre compte. Merci de réessayer ultérieurement.",
          },
        });
      }
    }

    return ctx.render({});
  },
};

export default async function UserSettings(req: Request, ctx: RouteContext) {
  const user = ctx.state.user as User;
  const toast = ctx.data?.toast;

  if (!user) return <div className={"text-text"}>Not logged in</div>;
  return (
    <>
      <form
        class="flex-col justify-center items-start gap-5 inline-flex"
        method="POST"
      >
        <input type="hidden" name="action" value="changeEmail" />
        <input type="hidden" name="email" value={user.email} />
        <table className="table-auto border-collapse settings-table">
          <thead>
            <tr>
              <th className="text-text_grey text-xs text-left" colSpan={2}>
                Changer adresse mail
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>
                  Adresse mail
                </p>
              </td>
              <td>
                {/* Set width to make the other inputs align */}
                <p class="text-text_grey w-7">{user.email}</p>
              </td>
            </tr>
            {/* TODO: Add email change feature when the Resend email feature is implemented */}
            {
              /* <tr>
              <td>
                <p>
                  Nouvelle adresse mail
                </p>
              </td>
              <td>
                <Input
                  field={{
                    name: "newEmail",
                    type: "email",
                    required: true,
                    validation: verifyEmailIntegrity,
                  }}
                  onChange={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Button type="submit">Changer de mot de passe</Button>
              </td>
            </tr> */
            }
          </tbody>
        </table>
      </form>

      <UserRevokeAccount />

      <ToasterWrapper content={toast} />
    </>
  );
}
