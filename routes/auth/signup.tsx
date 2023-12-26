import SignupForm from "@islands/SignupForm.tsx";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getUserFromSession, supabaseSSR } from "@services/supabase.ts";

import {
  verifyEmailIntegrity,
  verifyPasswordIntegrity,
  verifySamePassword,
} from "@utils/login.ts";

type formDatas = {
  email: string;
  password: string;
  confirmpassword: string;
};

interface AuthData {
  message?: string;
  error?: string;
}

export const handler: Handlers<AuthData> = {
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.formData();

    const url = new URL(req.url);
    const res = new Response();

    const formData: formDatas = {
      email: form.get("email")?.toString() as string,
      password: form.get("password")?.toString() as string,
      confirmpassword: form.get("confirmpassword")?.toString() as string,
    };

    if (!formData.email || !verifyEmailIntegrity(formData.email)) {
      return ctx.render();
    }
    if (!formData.password || !verifyPasswordIntegrity(formData.password)) {
      return ctx.render();
    }
    if (
      !formData.confirmpassword ||
      !verifySamePassword(formData.password, formData.confirmpassword)
    ) return ctx.render();

    console.log("signup form correct, now signing up")

    const supa = supabaseSSR(req, res);
    console.log("signup supa", supa)

    const { error } = await supa.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: "http://localhost:8000/auth/callback",
      },
    });

    if (!error) {
      console.log("signup success")
      const rendered = await ctx.render({
        message: "Check your email for the login link",
      });
      return new Response(rendered.body, {
        headers: res.headers,
      });
    }
    console.log("signup error:", error)
    return ctx.render({ error: error.message });
  },

  async GET(req, ctx) {

    const user = await getUserFromSession(req);
    if (user) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/admin/pages",
        },
      });
    }

    return ctx.render({});
  },
};

export default function Signup(data?: PageProps<AuthData>) {
  return <SignupForm {...data}/>;
}
