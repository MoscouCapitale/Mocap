import { FreshContext } from "fresh";
import ky from "ky";
import { Handlers } from "fresh/compat";
import { define } from "@utils/app.ts";

export const handler = define.handlers({
  async GET(ctx: FreshContext) {
    const req = ctx.req;
    const url = new URL(req.url);
    const eUrl = url.searchParams.get("eUrl");

    if (eUrl?.includes("deezer")) {
      const deezerUrl = `https://api.deezer.com/oembed?url=${encodeURIComponent(eUrl)}`;
      const data = await ky(deezerUrl).text();

      return new Response(data, {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } else if (eUrl?.includes("instagram")) {
      const instagramUrl = `https://www.instagram.com/api/v1/oembed/?hidecaption=1&url=${encodeURIComponent(eUrl)}`;
      const data = await ky(instagramUrl).text();

      return new Response(data, {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    } else {
      return new Response("Invalid URL", { status: 400 });
    }
  },
});
