import { authDefine } from "@utils/app.ts";
import { authMiddleware } from "@utils/server.ts";

export default authDefine.middleware(async (ctx) => {
  const req = ctx.req;
  const methodColors: Record<string, string> = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "purple",
    OPTIONS: "gray",
  };

  const color = methodColors[req.method] || "black";

  console.log(`%c${req.method} (${ctx.route}) ${req.url}`, `color: ${color}`);

  return await authMiddleware(ctx);

  // let { user } = await getUserFromSession(req);
  // let session: Session | null = null;

  // // check if access token is expired
  // if (!user && accessTokenExpired(req)) {
  //   console.log("API - access token expired");
  //   const refresh = await refreshAccessToken(req);

  //   console.log(
  //     `Refreshing access token. Has user: ${refresh?.user ? "yes" : "no"}, has session: ${
  //       refresh?.session ? "yes" : "no"
  //     }`,
  //   );

  //   if (!refresh?.session) return new Response(null, { status: 401 });

  //   if (refresh?.user) {
  //     user = refresh.user as User;
  //   }

  //   if (refresh?.session) {
  //     session = refresh.session;
  //   }
  // }

  // if (!user) return new Response(null, { status: 401 });

  // ctx.state.user = user as User;

  // const next = await ctx.next();
  // if (session?.access_token) {
  //   setAuthCookie(next, session?.refresh_token, session?.access_token);
  // }
  // return next;
});
