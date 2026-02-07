import { FreshContext } from "fresh";

export async function handler(ctx: FreshContext) {
  const req = ctx.req;
  const resp = await ctx.next();
  return resp;
}
