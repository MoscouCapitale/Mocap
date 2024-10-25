import { Handlers } from "$fresh/server.ts";
import { setAuthCookie, supabase, supabaseSSR } from "@services/supabase.ts";

/**
 * Handle the callback from the OAuth provider
 * 
 * This page is only used on OTP sign in and sign up, to provide a PKCE flow callback.
 * 
 */
export const handler: Handlers = {
  async GET(req, ctx) {
    const res = new Response();
    const sup = supabaseSSR(req, res);
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const redirectURL = url.searchParams.get("redirect");

    // The error code is used by supabase to return errors using magic links
    const errorCode = url.searchParams.get("error_code");

    if (errorCode) {
      switch (errorCode) {
        case "403":
          return new Response("", {
            status: 303,
            headers: {
              Location: `/auth?error_code=${errorCode}&error_message=${encodeURIComponent('Le lien a expiré ou à déjà été utilisé, merci de réessayer.')}`,
            },
          });
        default:
          return ctx.render({ type: "default" });
      }
    }

    if (typeof code == "string") {
      const { data, error } = await sup.auth.exchangeCodeForSession(code);

      if (error) {
        console.log("auth error", error);
        return new Response("", {
          status: 303,
          headers: {
            Location: `/auth${redirectURL ? `?redirect=${redirectURL}` : ""}`,
          },
        });
      }

      const session = data?.session;
      if (session?.access_token && session.refresh_token) {
        const { error } = await sup.auth.getUser(session.access_token);
        if (!error) {
          const resp = new Response("", {
            status: 303,
            headers: {
              Location: redirectURL || "/admin/pages",
            },
          });

          setAuthCookie(resp, session.refresh_token, session.access_token);

          return resp;
        }
      }
    }

    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth`,
      },
    });
  },
};
