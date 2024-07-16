import { FreshContext, Handlers } from "$fresh/server.ts";
import { supabase as supa } from "@services/supabase.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { getAvailableSizes, MNode } from "@models/Canva.ts";
import { getBrickFromType } from "@services/bricks.ts";

export const handler: Handlers<MNode | null> = {
  async GET(req: Request, ctx: FreshContext) {

    const nodesFile = await Deno.readTextFile("./savedNodes.json");
    return new Response(nodesFile, { status: 200 });

    const { data: nodes, error } = await supa.from("Node").select("*");

    // Quick debug methods to allow easier dev on low bitrate networks    

    const badRes = evaluateSupabaseResponse(nodes, error);
    if (badRes) return badRes;

    if (!nodes || nodes.length === 0) {
      try {
        const nodes = await Deno.readTextFile("./savedNodes.json");
        return new Response(nodes, { status: 200 });
      } catch (e) {
        console.error("Error while trying to retrieve savedNodes.json: ", e)
        return new Response(null, { status: 304 });
      }
      
    }

    for (const n of nodes) {
      if (!n.type) continue;
      const res = await getBrickFromType(n.type, n[n.type as keyof MNode]);
      if (!res.error && res[0]?.id) {
        n.content = res[0];
      } else {
        console.log(
          `Error while trying to get content for node ${n.id}: `,
          res.error,
        );
      }

      // If badly saved, reset the size
      const nodeSize = { width: n.width, height: n.height };
      n.sizes = getAvailableSizes(n.type);
      if (!n.sizes.includes(nodeSize)) {
        n.width = n.sizes[0].width;
        n.height = n.sizes[0].height;
      }

      // If Y below 40, set it to 40 (to avoid the top bar)
      if (n.y < 40) n.y = 40;
    }

    try {
      await Deno.writeTextFile("./savedNodes.json", JSON.stringify(nodes));
    } catch (e) {
      console.error("Error while writing to 'savedNode.json': ", e)
    }

    return new Response(JSON.stringify(nodes), { status: 200 });
  },
};
