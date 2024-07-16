import { VNode } from "preact";
import {
  Album as AlbumType,
  BricksType,
  HeroSection as HeroSectionType,
  PlateformLink as PlateformLinkType,
  Single as SingleType,
  Text as TextType
} from "@models/Bricks.ts";

import Single from "@islands/Bricks/Single.tsx";
import Album from "@islands/Bricks/Album.tsx";
import HeroSection from "@islands/Bricks/HeroSection.tsx";
import Text from "@islands/Bricks/Text.tsx";
import PlateformLink from "@islands/Bricks/PlatformLink.tsx";
import { MNode } from "@models/Canva.ts";

export const getBrickFromBrickType = (
    node: MNode
): VNode | null => {
    const type = node.type;
    const content = node.content;
    if (type === "HeroSection") return <HeroSection content={content as HeroSectionType} />
    if (type === "Single") return <Single content={content as SingleType} />
    if (type === "Album") return <Album content={content as AlbumType} />
    if (type === "Text") return <Text content={content as TextType} />
    if (type === "Platform_Link") return <PlateformLink content={content as PlateformLinkType} />
    return null;
};
