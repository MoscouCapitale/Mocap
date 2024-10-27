import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import AuthForm from "@islands/AuthForm.tsx";
import { FormType } from "@models/Authentication.ts";
import { handleSignInOTP, handleSignInPassword, handleSignUp } from "@services/authentication.ts";
import { getUserFromSession, supabaseSSR } from "@services/supabase.ts";
import { verifyEmailIntegrity } from "@utils/login.ts";

export const handler: Handlers<FormType> = {
  // When accessing the /auth route
  async GET(req: Request, ctx: FreshContext) {
    const params = new URL(req.url).searchParams;

    // Retrieve, from the url, the error code
    const error_code = params.get("error_code");
    const error_message = params.get("error_message");

    if (error_code) {
      return ctx.render({ type: "default", error: { message: error_message } });
    }

    /** If we just done an action, we display a message. Primarily used for OTP sign up, when you just
     * confirmed your email and are redirected to the sign in page, waiting to be approved by an admin. */
    const actionDone = params.get("action_done");
    if (actionDone) {
      return ctx.render({
        type: "action_done",
        additional_data: {
          message: actionDone,
        },
      });
    }

    // Get the user from the current session
    const { user, error } = await getUserFromSession(req);
    if (user) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/admin/pages",
        },
      });
    }

    if (error) {
      switch (error.status) {
        case 403:
          return ctx.render({
            type: "default",
            error: { message: "Votre session a expiré, merci de vous ré-authentifier." },
          });
        case 500:
        default:
          return ctx.render({ type: "default" });
      }
    }

    // If no error, render the default page (login form)
    return ctx.render({ type: "default" });
  },
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.formData();
    const url = new URL(req.url);
    const redirectURL = url.searchParams.get("redirect");

    const authType = form.get("authtype")?.toString() || "signin";

    const formData = {
      email: form.get("email")?.toString() || "",
      password: form.get("password")?.toString() || "",
      confirmpassword: form.get("confirmpassword")?.toString() || "",
    };

    const res = new Response();

    setTimeout(async () => {
      const render = await ctx.render({
        type: "default",
        additional_data: {
          email: formData.email,
        },
      });
      return new Response(render.body, {
        headers: res.headers,
      });
    }, 5000);

    if (!formData.email || verifyEmailIntegrity(formData.email) !== "") {
      const render = await ctx.render({ type: "default", error: "Invalid email" });
      return new Response(render.body, {
        headers: res.headers,
      });
    }

    const supa = supabaseSSR(req, res);

    // Signin
    if (authType === "signin") {
      // If a password is not provided, it means the user is trying to sign in with OTP
      if (!formData.password) {
        const render = await handleSignInOTP(supa, redirectURL, formData.email, url.origin, res, ctx);
        return render;
      } else {
        // If a password is provided, it means the user is trying to sign in with password
        const render = await handleSignInPassword(
          supa,
          redirectURL,
          formData.email,
          formData.password,
          url.origin,
          res,
          ctx,
        );
        return render;
      }
    }

    // Signup
    if (authType === "signup") {
      const render = await handleSignUp(
        supa,
        formData.email,
        formData.password,
        formData.confirmpassword,
        url.origin,
        res,
        ctx,
      );
      return render;
    }

    // Default
    const render = await ctx.render({ type: "default" });
    return new Response(render.body, {
      headers: res.headers,
    });
  },
};

export default function AuthPage({ data }: PageProps<FormType>) {
  return (
    <>
      <AuthForm {...data} />

      <a
        className={"text-text_grey text-sm absolute bottom-2 right-2 transition-all hover:text-text"}
        href="/auth/resetpassword"
      >
        Mot de passe oublié ?
      </a>
    </>
  );
}
