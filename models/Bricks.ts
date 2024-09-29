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

interface HeroSection extends Brick {
  title?: string;
  subtitle?: string;
  media: Image | Video | null;
  cta?: MediaCTA;
  style?: HeroSectionStyle;
}

interface Single extends Brick {
  title: string;
  media: Image | Video | null;
  track: Track;
  hoverable: boolean;
  platforms?: PlateformLink[];
  cta?: MediaCTA;
}

interface Album extends Brick {
  title: string;
  media: Image | Video | null;
  hoverable: boolean;
  platforms?: PlateformLink[];
  tracklist?: Track[];
  cta?: MediaCTA;
}

interface Text extends Brick {
  text: string;
  special: string;
}

// Type social is a brick type for social networks, but has the same attributes as PlateformLink
type Social = PlateformLink;

// interface Tiles extends Brick {
//   content: (Single | Album | Text | Social)[];
// }

type Track = {
  id: number;
  name: string;
  artist: Artist[];
  platforms?: PlateformLink[];
  created_at: string;
  updated_at: string;
};

type Artist = {
  id: number;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
};

interface PlateformLink extends Brick {
  platform: Platform;
  url: string;
};

type Platform = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

const BrickModifiableAttributes = {
  name: "Nom",
  title: "Titre",
  media: "Média",
  subtitle: "Sous-titre",
  cta: "Lien",
  hoverable: "Effet au survol",
  platforms: "Plateformes",
  tracklist: "Tracklist",
  text: "Texte",
  special: "Spécial",
  plateform: "Plateforme",
  url: "Lien",
  icon: "Icone",
  track: "Track",
  artist: "Artistes",
  style: "Style",
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

type availBricks = HeroSection | Single | Album | Text | Social | PlateformLink;

export type { Album, HeroSection, PlateformLink, Single, Social, Text, Track, availBricks };

export { 
  BrickModifiableAttributes, 
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
        special: "",
      } as Text;
    case BricksType.Platform_Link:
      return {
        name: "",        
        url: "",
        platform: {},
      } as Social;
    default:
      throw new Error(`Unsupported brick type: ${brickType}`);
  }
}
