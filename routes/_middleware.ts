import { define } from "@utils/app.ts";
import { getPB } from "@utils/db.ts";

export default define.middleware((ctx) => {
  // https://github.com/pocketbase/js-sdk#ssr-integration
  ctx.state.pb = getPB();
  return ctx.next();
});
