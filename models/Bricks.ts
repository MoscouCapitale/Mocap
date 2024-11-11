import { Image, MediaCTA, Video } from "@models/Medias.ts";
import { TableNames } from "@models/database.ts";

interface Brick {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  type?: BricksType;
  nodeId?: string;
}

export interface HeroSection extends Brick {
  title?: string;
  subtitle?: string;
  media: Image | Video | null;
  cta?: MediaCTA;
  style?: HeroSectionStyle;
}

export interface Single extends Brick {
  title: string;
  media: Image | Video | null;
  track: Track;
  hoverable: boolean;
  platforms?: PlatformLink[];
  cta?: MediaCTA;
}

export interface Album extends Brick {
  title: string;
  media: Image | Video | null;
  hoverable: boolean;
  platforms?: PlatformLink[];
  tracklist?: Track[];
  cta?: MediaCTA;
}

export interface Text extends Brick {
  text: string;
  media: Image | Video | null;
}

export type Track = {
  id: number;
  name: string;
  artist: Artist[];
  platforms?: PlatformLink[];
  created_at: string;
  updated_at: string;
};

export type Artist = {
  id: number;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export interface PlatformLink extends Brick {
  platform: Platform;
  url: string;
};

export type Platform = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

enum BricksType {
  HeroSection = "HeroSection",
  Single = "Single",
  Album = "Album",
  Text = "Text",
  Platform_Link = "Platform_Link",
}

type HeroSectionStyle = "scrolling-hero";

const getBrickTypeLabel = (type: BricksType): string => {
  switch (type) {
    case BricksType.HeroSection:
      return "Principale";
    case BricksType.Single:
      return "Single";
    case BricksType.Album:
      return "Album";
    case BricksType.Text:
      return "Texte";
    case BricksType.Platform_Link:
      return "Réseaux sociaux";
    default:
      console.error(`Unsupported label brick type: ${type}`);
      return "";
  }
}

const getBrickTypeTableName = (type: BricksType): TableNames => {
  switch (type) {
    case BricksType.HeroSection:
      return "Bricks_HeroSection";
    case BricksType.Single:
      return "Bricks_Single";
    case BricksType.Album:
      return "Bricks_Album";
    case BricksType.Text:
      return "Bricks_Text";
    case BricksType.Platform_Link:
      return "Platform_Link";
    default:
      throw new Error(`Unsupported brick type: ${type}`);
  }
}

export type availBricks = HeroSection | Single | Album | Text | PlatformLink;

export { 
  BricksType, 
  getBrickTypeLabel,
   getBrickTypeTableName,  
};

export function createDefaultBrick(
  brickType: BricksType,
): availBricks {
  switch (brickType) {
    case BricksType.HeroSection:
      return {
        name: "",
        title: "",
        subtitle: "",
        media: null,
        cta: {},
        style: "scrolling-hero",
      } as HeroSection;
    case BricksType.Single:
      return {
        name: "",
        title: "",
        media: null,
        track: {},
        hoverable: false,
        cta: {},
        platforms: [{}],
      } as Single;
    case BricksType.Album:
      return {
        name: "",
        title: "",
        media: null,
        hoverable: false,
        platforms: [{}],
        tracklist: [{}],
        cta: {},
      } as Album;
    case BricksType.Text:
      return {
        name: "",
        text: "",
      } as Text;
    case BricksType.Platform_Link:
      return {
        name: "",        
        url: "",
        platform: {},
      } as PlatformLink;
    default:
      throw new Error(`Unsupported brick type: ${brickType}`);
  }
}
