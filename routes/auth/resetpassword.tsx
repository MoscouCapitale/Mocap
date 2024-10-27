import { Handlers, RouteContext } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";

import { ToasterToast } from "@hooks/toast.tsx";
import ToasterWrapper from "@islands/UI/ToasterWrapper.tsx";
import ResetPassword from "@islands/Users/ResetPassword.tsx";
import { verifyPasswordIntegrity } from "@utils/login.ts";

type HandlerType = {
  toast: Omit<ToasterToast, "id"> | null;
} | Record<string | number | symbol, never>;

export const handler: Handlers<HandlerType | null> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const access_token = form.get("access_token")?.toString() || "";

    // If no access_token, it means we send a reset password email
    if (!access_token) {
      const { data, error } = await supa.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(req.url).origin}/auth/resetpassword?email=${email}`,
      });

      if (error) {
        console.error("Error while sending reset password email", error);
        return ctx.render({
          toast: {
            title: "Erreur lors de la réinitialisation du mot de passe",
            description:
              "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
          },
        });
      }

      return ctx.render({
        toast: {
          description:
            "Si cet email est associé à un compte, un email de réinitialisation de mot de passe vous a été envoyé.",
        },
      });
    }

    // Checks if the password is valid
    if (verifyPasswordIntegrity(password) !== "") {
      return ctx.render({
        toast: {
          title: "Erreur lors de la réinitialisation du mot de passe",
          description:
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, un chiffre et un caractère spécial.",
        },
      });
    }

    // If no user, it means either the token is invalid or the user does not exist.
    const { data: user } = await supa.auth.getUser(access_token);
    if (!user.user) {
      console.error("Error while getting user from access token", user);
      return ctx.render({
        toast: {
          title: "Erreur lors de la réinitialisation du mot de passe",
          description:
            "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
        },
      });
    }

    // If password is set, we reset the password. Uses the updateUsersById because its simpler on server side.
    const { error } = await supa.auth.admin.updateUserById(user.user.id as string, { password });

    if (error) {
      console.error("Error while updating user password", error);
      return ctx.render({
        toast: {
          title: "Erreur lors de la réinitialisation du mot de passe",
          description:
            "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
        },
      });
    }

    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?action_done=${
          encodeURIComponent(
            "Votre mot de passe a été réinitialisé. Vous pouvez désormais quitter cette page et vous reconnecter.",
          )
        }`,
      },
    });
  },
};

export default function UserSettings(_req: Request, ctx: RouteContext) {
  const toast = ctx.data?.toast;
  return (
    <>
      <ResetPassword />
      <a
        className={"text-text_grey text-sm absolute bottom-2 right-2 transition-all hover:text-text"}
        href="/auth"
      >
        Retourner en arrière
      </a>
      <ToasterWrapper content={toast} />
    </>
  );
}
