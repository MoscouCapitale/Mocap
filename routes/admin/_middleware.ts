import { FreshContext } from "$fresh/server.ts";
import {
  User,
  Session,
} from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import {
  accessTokenExpired,
  getUserFromSession,
  refreshAccessToken,
  setAuthCookie
} from "@services/supabase.ts";

export interface AppState {
  user: User;
}

export async function handler(
  req: Request,
  ctx: FreshContext<AppState>
) {
  let user = await getUserFromSession(req);
  let session: Session | null = null;

  console.log("user", user);
  console.log("session", session);

  // check if access token is expired
  if (!user && accessTokenExpired(req)) {
    const refresh = await refreshAccessToken(req);

    if (!refresh?.session) {
      console.log("unable to refresh session");
      return new Response("", {
        status: 303,
        headers: {
          Location: `/auth/signin?redirect=${req.url}`,
        },
      });
    }

    if (refresh?.user) {
      user = refresh.user;
    }

    if (refresh?.session) {
      session = refresh.session;
    }
  }

  if (!user) {
    console.log("un-authed user trying to access protected -admin- route");
    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth/signin?redirect=${req.url}`,
      },
    });
  }
  ctx.state.user = user;

  const next = await ctx.next();
  if (session?.access_token) {
    setAuthCookie(next, session?.refresh_token, session?.access_token);
  }
  return next;
}
