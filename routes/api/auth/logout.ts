import { define } from "@utils/app.ts";

export const handler = define.handlers({
  POST(ctx) {
    ctx.state.pb.authStore?.clear?.();
    return ctx.redirect("/");
  },
});
