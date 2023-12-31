import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  console.log(`${req.method} (${ctx.destination}) ${req.url}`)
  const resp = await ctx.next();
  return resp;
}