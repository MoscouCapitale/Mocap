import { supabase as supa } from "@services/supabase.ts";

import { ToasterWrapper } from "@islands/UI";
import ResetPassword from "@islands/Users/ResetPassword.tsx";
import { define } from "@utils/app.ts";
import { verifyPasswordIntegrity } from "@utils/login.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const {
      state: { pb },
    } = ctx;
    const req = ctx.req;
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const access_token = form.get("access_token")?.toString() || "";

    // If no access_token, it means we send a reset password email
    if (!access_token) {
      try {
        // TODO: was here
        /** là je dois reset le mdp (envoyer mail avec token qui renvoi sur cette page et permet de changer mdp avec token)
         * requestPasswordReset envoi un mail qui envoi vers la page pocketbase.
         * est ce que je peux utiliser https://pocketbase.io/jsvm/interfaces/core.Collection.html#passwordResetToken, et envoi moi meme
         * email modifié avec https://pocketbase.io/jsvm/interfaces/core.Collection.html#resetPasswordTemplate ?
         * Ou alors appeler route custom dans le back qui envoi email custom.
         */
        await pb.collection("users").requestPasswordReset(email);
        return {
          data: {
            toast: {
              description: "Si cet email est associé à un compte, un email de réinitialisation de mot de passe vous a été envoyé.",
            },
          },
        };
      } catch (error) {
        console.error("Error while sending reset password email", error);
        return {
          data: {
            toast: {
              title: "Erreur lors de la réinitialisation du mot de passe",
              description: "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
            },
          },
        };
      }
    }

    // Checks if the password is valid
    if (verifyPasswordIntegrity(password) !== "") {
      return {
        data: {
          toast: {
            title: "Erreur lors de la réinitialisation du mot de passe",
            description: "Le mot de passe doit contenir au moins 10 caractères, une majuscule, un chiffre et un caractère spécial.",
          },
        },
      };
    }

    // If no user, it means either the token is invalid or the user does not exist.
    const { data: user } = await supa.auth.getUser(access_token);
    if (!user.user) {
      console.error("Error while getting user from access token", user);
      return {
        data: {
          toast: {
            title: "Erreur lors de la réinitialisation du mot de passe",
            description: "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
          },
        },
      };
    }

    // If password is set, we reset the password. Uses the updateUsersById because its simpler on server side.
    const { error } = await supa.auth.admin.updateUserById(user.user.id as string, { password });

    if (error) {
      console.error("Error while updating user password", error);
      return {
        data: {
          toast: {
            title: "Erreur lors de la réinitialisation du mot de passe",
            description: "Une erreur est survenue lors de la réinitialisation de votre mot de passe. Merci de réessayer ultérieurement.",
          },
        },
      };
    }

    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?action_done=${encodeURIComponent(
          "Votre mot de passe a été réinitialisé. Vous pouvez désormais quitter cette page et vous reconnecter.",
        )}`,
      },
    });
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <ResetPassword />
      <a className="text-text_grey text-sm absolute bottom-2 right-2 transition-all hover:text-text" href="/auth">
        Retourner en arrière
      </a>
      <ToasterWrapper content={data?.toast} />
    </>
  );
});
