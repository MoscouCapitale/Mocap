import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: FreshContext) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/auth",
      },
    });
  },
};

export default function Home() {
  return;
}
