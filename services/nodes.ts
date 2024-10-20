import { availBricks } from "@models/Bricks.ts";
import { DBMNode, getAvailableSizes, MNode } from "@models/Canva.ts";
import { evaluateSupabaseResponse } from "@utils/api.ts";
import { supabase as supa } from "@services/supabase.ts";
import { BricksType } from "@models/Bricks.ts";
import { getBrickFromType } from "@services/bricks.ts";

export const fetchNode = async (
  id?: string,
  force?: boolean,
): Promise<{ data: MNode[] | null; error: Response | null }> => {
  const debug = force; // TODO: just a temp var to have the savedNodes.json file

  debug
    ? console.log("Fetch from db")
    : console.log("Fetch from savedNodes.json");

  if (!debug) {
    try {
      const nodes = await Deno.readTextFile("./savedNodes.json");
      return { data: JSON.parse(nodes), error: null };
    } catch (e) {
      console.error("Error while trying to retrieve savedNodes.json: ", e);
      return { data: null, error: new Response(null, { status: 304 }) };
    }
  }

  let res;
  const nodes: MNode[] = [];
  if (id) res = await supa.from("Node").select("*").eq("id", id);
  else res = await supa.from("Node").select("*");

  if (evaluateSupabaseResponse(res.data, res.error)) {
    return { data: null, error: new Response(null, { status: 500 }) };
  }

  // FIXME: this is to debug
  if (!res.data || res.data.length === 0) {
    try {
      const nodes = await Deno.readTextFile("./savedNodes.json");
      return { data: JSON.parse(nodes), error: null };
    } catch (e) {
      console.error("Error while trying to retrieve savedNodes.json: ", e);
      return { data: null, error: new Response(null, { status: 304 }) };
    }
  }

  for (const n of res.data) {
    if (!n.type) continue;
    // @ts-ignore - I don't care ahahah
    const res = await getBrickFromType(n.type, n[n.type]);

    if (res.error || !res.data || !res.data[0]?.id) {
      console.error(
        `Error while trying to get content for node ${n.id}: `,
        res.error,
      );
      continue;
    }

    // @ts-ignore - res.data[0] cannot be null
    const addedNode: MNode = {
      ...n,
      content: res.data[0],
      sizes: getAvailableSizes(n.type) || [],
    };

    // If badly saved, reset the size (HeroSection have a dynamic size so except them)
    const nodeSize = { width: n.width, height: n.height };
    if (addedNode.type !== "HeroSection" && !assertEqualSizes(addedNode.sizes, nodeSize)) {
      n.width = addedNode.sizes[0].width;
      n.height = addedNode.sizes[0].height;
    }

    // If Y below 40, set it to 40 (to avoid the top bar)
    if (n.y < 40) n.y = 40;

    nodes.push(addedNode);
  }

  if (!debug) {
    try {
      await Deno.writeTextFile("./savedNodes.json", JSON.stringify(nodes));
    } catch (e) {
      console.error("Error while writing to 'savedNode.json': ", e);
    }
  }

  return { data: nodes, error: null };
};

const assertEqualSizes = (
  availableSizes: MNode["sizes"],
  size: MNode["sizes"][0],
) => {
  if (!availableSizes || availableSizes.length === 0) return false;
  return availableSizes.some((s) =>
    s.width === size.width && s.height === size.height
  );
};

/**
 * Create the needed node from a brick
 *
 * If no nodeId is provided or the node does not exist, it will create a new node.
 *
 * We do not update the node, because only the content of the brick changes, and it is tied to the node.
 *
 * @param {availBricks} brick - The brick to create the node from
 * @param {string | null} nodeId - The id of the node to update
 * @param {BricksType} type - The type of the brick
 * @returns {Promise<DBMNode | null>} The created or updated node. Null if an error occured
 */
export const createOrUpdateNodeFromBrick = async (
  brick: availBricks,
  nodeId: string | null,
  type: BricksType,
): Promise<DBMNode | null> => {
  if (!nodeId) return await createNodeFromBrick(type, brick);

  //   const { data, error } = await supa.from("Node").select().eq("id", nodeId);
  const { data, error } = await fetchNode(nodeId, true);

  if (error) {
    console.error(
      "createOrUpdateNodeFromBrick -- Error while fetching node",
      error,
    );
    return null;
  }

  if (!data || data.length === 0) return await createNodeFromBrick(type, brick);

  return data[0] as DBMNode;
};

const createNodeFromBrick = async (
  type: BricksType,
  brick: availBricks,
): Promise<DBMNode | null> => {
  const sizes = getAvailableSizes(type);

  const savedNode: DBMNode = {
    type,
    x: 0,
    y: 0,
    width: sizes ? sizes[0].width : -1,
    height: sizes ? sizes[0].height : -1,
  };

  switch (type) {
    case "HeroSection":
      savedNode.HeroSection = brick.id;
      break;
    case "Single":
      savedNode.Single = brick.id;
      break;
    case "Album":
      savedNode.Album = brick.id;
      break;
    case "Text":
      savedNode.Text = brick.id;
      break;
    case "Platform_Link":
      savedNode.PlatformLink = brick.id;
      break;
    default:
      console.error(
        `Could not find a suitable type for "${type}" in createNodeFromBrick`,
      );
      return null;
  }

  const { data: newNode, error } = await supa.from("Node").insert(savedNode).select();
  if (evaluateSupabaseResponse(newNode, error)) return null;

  if (newNode && newNode[0].id) {
    const { data } = await fetchNode(newNode[0].id, true);
    return Array.isArray(data) ? data[0] as DBMNode : null;
  }

  return null;
};
