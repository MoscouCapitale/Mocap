import { FreshContext } from "$fresh/server.ts";
import {
  Session,
  User,
} from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import {
  accessTokenExpired,
  getUserFromSession,
  refreshAccessToken,
  setAuthCookie,
  updateAuthorizations,
} from "@services/supabase.ts";

export interface AppState {
  user: User;
}

// TODO: find better way to do this
const authorizedRoles = ["authenticated", "mocap_admin", "supabase_admin"];

// TODO: bug: why is user able to see admin page when not authorized and first connexion from confirmation email?

export async function handler(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  let user = await getUserFromSession(req);
  let session: Session | null = null;

  // console.log("user", user);
  // console.log("session", session);

  // check if access token is expired
  if (!user && accessTokenExpired(req)) {
    console.log("access token expired");
    const refresh = await refreshAccessToken(req);

    if (!refresh?.session) {
      console.log("unable to refresh session");
      return new Response("", {
        status: 303,
        headers: {
          Location: `/auth?redirect=${req.url}`,
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
    console.log("unable to get user");
    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?redirect=${req.url}`,
      },
    });
  }

  if(user.user_metadata.is_authorised === undefined) updateAuthorizations(user);

  if (user.role && !authorizedRoles.includes(user.role) || user.user_metadata?.is_authorised === false) {
    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?redirect=${req.url}&error=user_not_authorized`,
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
