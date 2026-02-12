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

    //TODO: maybe we should redirect to another page, like resetpassword/[:token]
    // If no access_token, it means we send a reset password email
    if (!access_token) {
      try {
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

    try {
      const data = await pb.collection('users').confirmPasswordReset(
        access_token,
        password,
        password,
      );
      console.dir(data)
      return ctx.redirect(
        `/auth?action_done=${encodeURIComponent("Votre mot de passe a été réinitialisé. Vous pouvez désormais quitter cette page et vous reconnecter.")}`,
      );
    } catch (error) {
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
