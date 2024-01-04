import AuthForm from "@islands/AuthForm.tsx";
import SimpleMessage from "@components/SimpleMessage.tsx";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { FormType } from "@models/Authentication.ts";
import { verifyEmailIntegrity, verifyPasswordIntegrity, verifySamePassword } from "@utils/login.ts";
import { supabaseSSR, getUserFromSession } from "@services/supabase.ts";
import { handleSignIn, handleSignUp } from "@services/authentication.ts";

export const handler: Handlers<FormType> = {
  async GET(req: Request, ctx: FreshContext) {
    const user = await getUserFromSession(req);
    if (user) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/admin/pages",
        },
      });
    }

    return ctx.render({ type: "default" });
  },
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.formData();
    const url = new URL(req.url);
    const redirectURL = url.searchParams.get("redirect");

    const formData = {
      email: form.get("email")?.toString() || "",
      password: form.get("password")?.toString() || "",
      confirmpassword: form.get("confirmpassword")?.toString() || "",
    };

    const res = new Response();

    if (!formData.email || !verifyEmailIntegrity(formData.email)) {
      const render = await ctx.render({ type: "default", error: "Invalid email" });
      return new Response(render.body, {
        headers: res.headers,
      });
    }

    const supa = supabaseSSR(req, res);

    // Signin
    if (!formData.password) {
      const render = await handleSignIn(supa, redirectURL, formData.email, url.origin, res, ctx);
      return render;
    }

    // Signup
    const render = await handleSignUp(supa, formData.email, formData.password, formData.confirmpassword, url.origin, res, ctx);
    return render;
  },
};

export default function AuthPage({ data }: PageProps<FormType>) {
  const { type, additional_data } = data;
  return (
    <>
      {type !== "action_done" && <AuthForm {...data} />}
      {type === "action_done" && <SimpleMessage message={additional_data?.message} />}
    </>
  );
}
