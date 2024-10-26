import { FreshContext } from "$fresh/server.ts";
import { accessTokenExpired, getUserFromSession, refreshAccessToken, setAuthCookie } from "@services/supabase.ts";
import { Session, User, UserRole, UserStatus } from "@models/Authentication.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const methodColors: Record<string, string> = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "purple",
    OPTIONS: "gray",
  };

  const color = methodColors[req.method] || "black";

  console.log(`%c${req.method} (${ctx.destination}) ${req.url}`, `color: ${color}`);

  let { user } = await getUserFromSession(req);
  let session: Session | null = null;

  // check if access token is expired
  if (!user && accessTokenExpired(req)) {
    console.log("API - access token expired");
    const refresh = await refreshAccessToken(req);

    console.log(
      `Refreshing access token. Has user: ${refresh?.user ? "yes" : "no"}, has session: ${
        refresh?.session ? "yes" : "no"
      }`,
    );

    if (!refresh?.session) return new Response(null, { status: 401 });

    if (refresh?.user) {
      user = refresh.user as User;
    }

    if (refresh?.session) {
      session = refresh.session;
    }
  }

  if (!user) return new Response(null, { status: 401 });

  ctx.state.user = user as User;

  const next = await ctx.next();
  if (session?.access_token) {
    setAuthCookie(next, session?.refresh_token, session?.access_token);
  }
  return next;
}
