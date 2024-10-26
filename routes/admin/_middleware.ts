import { FreshContext } from "$fresh/server.ts";

import { accessTokenExpired, getUserFromSession, refreshAccessToken, setAuthCookie } from "@services/supabase.ts";
import { Session, User, UserRole, UserStatus } from "@models/Authentication.ts";

export interface AppState {
  user: User;
}

// TODO: find better way to do this
const authorizedRoles = [UserRole.ADMIN, UserRole.SADMIN];

// TODO: bug: why is user able to see admin page when not authorized and first connexion from confirmation email?

export async function handler(
  req: Request,
  ctx: FreshContext<AppState>,
) {
  // // FIXME: temporary solution for slow internet
  // const nextStp = await ctx.next();
  // return nextStp;

  let { user } = await getUserFromSession(req);
  let session: Session | null = null;

  // console.log("user", user);
  // console.log("session", session);

  // check if access token is expired
  if (!user && accessTokenExpired(req)) {
    console.log("access token expired");
    const refresh = await refreshAccessToken(req);

    console.log(
      `Refreshing access token. Has user: ${refresh?.user ? "yes" : "no"}, has session: ${
        refresh?.session ? "yes" : "no"
      }`,
    );

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
      user = refresh.user as User;
    }

    if (refresh?.session) {
      session = refresh.session;
    }
  }

  if (!user) {
    console.log("Unable to get user");
    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?redirect=${req.url}`,
      },
    });
  }

  // If the user is not an admin, or is not active, redirect to auth page with an error message.
  if (
    user.user_metadata?.isInit && !authorizedRoles.includes(user.user_metadata.role) ||
    user.user_metadata.status !== UserStatus.ACTV
  ) {
    let errorMessage =
      "Votre compte n'est pas encore validé. Merci de patienter le temps qu'un administrateur valide votre compte.";

    switch (user.user_metadata.status) {
      case UserStatus.DECL:
        errorMessage =
          "Votre compte a été refusé. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
        break;
      case UserStatus.BLCK:
        errorMessage =
          "Votre compte a été bloqué. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
        break;
      case UserStatus.BANN:
        errorMessage =
          "Votre compte a été banni définitivement. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
        break;
      case UserStatus.RQST:
      default:
        errorMessage =
          "Votre compte n'est pas encore validé. Merci de patienter le temps qu'un administrateur valide votre compte.";
        break;
    }

    return new Response("", {
      status: 303,
      headers: {
        Location: `/auth?redirect=${req.url}&error_code=401&error_message=${encodeURIComponent(errorMessage)}`,
      },
    });
  }

  ctx.state.user = user as User;

  const next = await ctx.next();
  if (session?.access_token) {
    setAuthCookie(next, session?.refresh_token, session?.access_token);
  }
  return next;
}
