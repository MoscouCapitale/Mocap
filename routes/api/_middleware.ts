import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const methodColors: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
    OPTIONS: 'gray',
  };

  const color = methodColors[req.method] || 'black';

  console.log(`%c${req.method} (${ctx.destination}) ${req.url}`, `color: ${color}`);
  
  const resp = await ctx.next();
  return resp;
}