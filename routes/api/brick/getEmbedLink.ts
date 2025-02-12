import { FreshContext, Handlers } from "$fresh/server.ts";
import ky from "ky";

export const handler: Handlers<any | null> = {
  async GET(req: Request, ctx: FreshContext) {

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
    }
    
    else {
        return new Response("Invalid URL", { status: 400 });
    }
  },
};
