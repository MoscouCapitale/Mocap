import { VNode } from "preact";
import {
  Album as AlbumType,
  BricksType,
  HeroSection as HeroSectionType,
  PlatformLink as PlatformLinkType,
  Single as SingleType,
  Text as TextType,
  Highlight as HighlightType,
  availBricks
} from "@models/Bricks.ts";

import Single from "@islands/Bricks/Single.tsx";
import Album from "@islands/Bricks/Album.tsx";
import HeroSection from "@islands/Bricks/HeroSection.tsx";
import Text from "@islands/Bricks/Text.tsx";
import PlatformLink from "@islands/Bricks/PlatformLink.tsx";
import { MNode } from "@models/Canva.ts";
import Placeholder from "@islands/Bricks/Placeholder.tsx";
import Highlight from "@islands/Bricks/Highlight.tsx";

interface AdditionalProps {
  isMovable?: boolean;
  asMainHeroSection?: boolean;
  animateConfig?: AnimationConfig;
  disableAnimations?: boolean
}

export type AnimationConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getBrickFromCanvaNode = (
    node: MNode,
    { ...args }: AdditionalProps
): VNode | null => {
    const type = node.type;
    const content = node.content;
    if (args.isMovable) return <Placeholder type={type as BricksType} content={content} nodeId={node.id} />

    if (type === "HeroSection") return <HeroSection content={content as HeroSectionType} {...args} />
    if (type === "Single") return <Single content={content as SingleType}  {...args} />
    if (type === "Album") return <Album content={content as AlbumType}  {...args} />
    if (type === "Text") return <Text content={content as TextType} {...args} />
    if (type === "Platform_Link") return <PlatformLink content={content as PlatformLinkType} sizeIndex={getBrickSizeIndex(node)} {...args} />
    if (type === "Highlight") return <Highlight content={content as HighlightType} {...args} />
    return null;
};

const getBrickSizeIndex = (node: MNode): number => {
  if (node.sizes.length < 2) return -1;
  return node.sizes.findIndex(s => s.height === node.height && s.width === node.width)
}

export const getBrickFromBrickData= (
  brick: availBricks,
  { ...args }: AdditionalProps
): VNode | null => {
  const type = brick.type;
  const content = brick;

  if (type === "HeroSection") return <HeroSection content={content as HeroSectionType} {...args} />
  if (type === "Single") return <Single content={content as SingleType}  {...args} />
  if (type === "Album") return <Album content={content as AlbumType}  {...args} />
  if (type === "Text") return <Text content={content as TextType} {...args} />
  if (type === "Platform_Link") return <PlatformLink content={content as PlatformLinkType} sizeIndex={1} {...args} />
  if (type === "Highlight") return <Highlight content={content as HighlightType} {...args} />
  return null;
};