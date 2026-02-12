import { IUser, UserRole, UserStatus } from "@models/Authentication.ts";
import { authDefine } from "./app.ts";

const publicRoutes: string[] = [];

const authorizedRoles = [UserRole.ADMIN, UserRole.SADMIN];

// use createDefine to have a "custom" typed state
export const authMiddleware = authDefine.middleware(async (ctx) => {

  console.log("Cookies", ctx.req.headers.get("cookie"))

  // load the store data from the request cookie string
  ctx.state.pb.authStore.loadFromCookie(ctx.req.headers.get("cookie") || "");

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    ctx.state.pb.authStore.isValid && (await ctx.state.pb.collection("users").authRefresh());
    const user = ctx.state.pb.authStore.record as IUser | null;
    if (!user) throw new Error();
    ctx.state.user = structuredClone(user);
  } catch (_) {
    // clear the auth store on failed refresh
    ctx.state.pb.authStore.clear();
  }

  console.log("Middleware state:", {
    isValid: ctx.state.pb.authStore.isValid,
    user: ctx.state.user,
    ctx: {
      // url: ctx.url,
      cookie: ctx.req.headers.get("cookie"),
    },
  });

  const path = ctx.url.pathname;
  const isPublic = publicRoutes.some((r) => path.startsWith(r));

  // If accessing protected route, check user
  if (!isPublic) {
    console.log("Route is not public. Check state");

    if (!ctx.state.pb.authStore.isValid || !ctx.state.user) {
      const redirectPath = encodeURIComponent(path);
      return ctx.redirect(`//auth${redirectPath ? `?redirect=${redirectPath}` : ""}`, 303);
    }

    const user = ctx.state.user;

    // If the user is not an admin, or is not active, redirect to auth page with an error message.
    if ((user.verified && !authorizedRoles.includes(user.role)) || user.status !== UserStatus.ACTV) {
      let errorMessage = "Votre compte n'est pas encore validé. Merci de patienter le temps qu'un administrateur valide votre compte.";

      switch (user.status) {
        case UserStatus.DECL:
          errorMessage = "Votre compte a été refusé. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
          break;
        case UserStatus.BLCK:
          errorMessage = "Votre compte a été bloqué. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
          break;
        case UserStatus.BANN:
          errorMessage = "Votre compte a été banni définitivement. Si vous pensez qu'il s'agit d'une erreur, merci de contacter un administrateur.";
          break;
        case UserStatus.RQST:
        default:
          errorMessage = "Votre compte n'est pas encore validé. Merci de patienter le temps qu'un administrateur valide votre compte.";
          break;
      }

      const redirectPath = encodeURIComponent(path);
      return ctx.redirect(`//auth?redirect=${redirectPath}&error_code=401&error_message=${encodeURIComponent(errorMessage)}`, 303);
    }
  }

  const response = await ctx.next();

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append("set-cookie", ctx.state.pb.authStore.exportToCookie());

  return response;
});
