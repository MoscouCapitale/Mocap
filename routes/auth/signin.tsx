import SigninForm from "@islands/SigninForm.tsx";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import {
  getUserFromSession,
  setAuthCookie,
  supabaseSSR,
} from "@services/supabase.ts";

type formDatas = {
  email: string;
  password: string;
};

interface AuthData {
  message?: string;
  error?: string;
}

export const handler: Handlers<AuthData> = {
  async POST(req: Request, ctx: FreshContext) {
    const form = await req.formData();
    const url = new URL(req.url);
    const redirectURL = url.searchParams.get("redirect");

    const res = new Response();

    const supa = supabaseSSR(req, res);
    //console.log("signin supa object:============= \n\n\n", supa);

    // TODO: password signin support
    if (!form.has("password")) {
      const { error } = await supa.auth.signInWithOtp({
        email: form.get("email") as string,
        options: {
          emailRedirectTo: `${url.origin}/auth/callback${
            redirectURL ? `?redirect=${redirectURL}` : ""
          }`,
        },
      });
      if (!error) {
        console.log("signin success with OTP");
        const rendered = await ctx.render({
          message: "Check your email for the login link",
        });
        return new Response(rendered.body, {
          headers: res.headers,
        });
      }
      console.log("signin error with OTP:", error);
      return ctx.render({ error: error.message });
    } else {
      const { error } = await supa.auth.signInWithOtp({
        email: form.get("email") as string,
        options: {
          emailRedirectTo: `${url.origin}/auth/callback${
            redirectURL ? `?redirect=${redirectURL}` : ""
          }`,
        },
      });
      if (!error) {
        console.log("signin success with OTP");
        const rendered = await ctx.render({
          message: "Check your email for the login link",
        });
        return new Response(rendered.body, {
          headers: res.headers,
        });
      }
      console.log("signin error with OTP:", error);
      return ctx.render({ error: error.message });
    }
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

export default function Signin(data?: PageProps<AuthData>) {
  return <SigninForm {...data} />;
}
