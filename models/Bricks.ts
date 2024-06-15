import { Image, MediaCTA, Video } from "@models/Medias.ts";

interface Brick {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface HeroSection extends Brick {
  title?: string;
  subtitle?: string;
  media: Image | Video | null;
  cta?: MediaCTA;
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

type PlateformLink = {
  id: number;
  name: string;
  platform: Platform;
  url: string;
  created_at: string;
  updated_at: string;
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
};

enum BricksType {
  HeroSection = "Principale",
  Single = "Single",
  Album = "Album",
  // TILES = "Tuiles",
  Text = "Texte",
  Platform_Link = "Réseaux sociaux",
  // PLATFORM_LINK = "Plateforme",
}

export type { Album, HeroSection, PlateformLink, Single, Social, Text, Track };

export { BrickModifiableAttributes, BricksType };

export function createDefaultBrick(
  brickType: BricksType,
): HeroSection | Single | Album | Text | Social | PlateformLink {
  switch (brickType) {
    case BricksType.HeroSection:
      return {
        name: "",
        title: "",
        subtitle: "",
        media: null,
        cta: {},
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
    // case BricksType.PLATFORM_LINK:
    //   return {
    //     name: "",
    //     url: "",
    //     platform: {}
    //   } as PlateformLink;
    default:
      throw new Error(`Unsupported brick type: ${brickType}`);
  }
}
