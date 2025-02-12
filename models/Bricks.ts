import { Image, MediaCTA, Video, Audio  , MediaControls, MediaObjectFit } from "@models/Medias.ts";
import { TableNames } from "@models/database.ts";

/** The default base brick interface. */
interface Brick {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  /** The id of the node (from `Node` table) associated with the brick */
  nodeId?: string;
}

/** The HeroSection brick interface.
 * 
 * Its a brick positionned at the top of a page, used a the main brick. It is animated and can have a scrolling effect. */
export interface HeroSection extends Brick {
  type: BricksType.HeroSection;
  title?: string;
  subtitle?: string;
  media: Image | Video | null;
  cta?: MediaCTA;
  style?: HeroSectionStyle;
}

/** The Single brick interface.
 * 
 * It is a brick that represents a single music track. */
export interface Single extends Brick {
  type: BricksType.Single;
  title: string;
  media: Image | Video | null;
  track: Track;
  hoverable: boolean;
  platforms?: PlatformLink[];
  cta?: MediaCTA;
  mediaFit: MediaObjectFit;
  controls?: MediaControls;
}

/** The Album brick interface.
 * 
 * It is a brick that represents a music album. Contains multiple tracks, each with artists and links to platforms. */
export interface Album extends Brick {
  type: BricksType.Album;
  title: string;
  media: Image | Video | null;
  hoverable: boolean;
  platforms?: PlatformLink[];
  tracklist?: Track[];
  cta?: MediaCTA;
  mediaFit: MediaObjectFit;
  controls?: MediaControls;
}

/** The Text brick interface.
 * 
 * Represents a simple text section. */
export interface Text extends Brick {
  type: BricksType.Text;
  /** The text content of the brick. Supports markdown. */
  text: string;
  media: Image | Video | null;
}

/** The PlatformLink brick interface.
 * 
 * Represents a simple link to a platform. */
export interface PlatformLink extends Brick {
  type: BricksType.Platform_Link;
  platform: Platform;
  url: string;
  in_footer: boolean;
};

/** The Highlight brick interface.
 * 
 * A simple brick with a media, optionnaly title/subtitle and a link. */
export interface Highlight extends Brick {
  type: BricksType.Highlight;
  media: Image | Video | null;
  title?: string;
  subtitle?: string;
  link?: string;
  mediaFit: MediaObjectFit;
  controls?: MediaControls;
  is_embed?: boolean;
}

/** The AudioBrick interface.
 * 
 * A brick that can hold an audio file.
 */
export interface AudioBrick extends Brick {
  type: BricksType.Audio;
  media: Image | Video | null;
  audio: Audio;
  track: Track;
  link?: string;
  mediaFit: MediaObjectFit;
  controls?: MediaControls;
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
  Highlight = "Highlight",
  Audio = "Audio",
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
    case BricksType.Highlight:
      return "Média";
    case BricksType.Audio:
      return "Son";
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
    case BricksType.Highlight:
      return "Bricks_Highlight";
    case BricksType.Audio:
      return "Bricks_Audio";
    default:
      throw new Error(`Unsupported brick type: ${type}`);
  }
}

export type availBricks = HeroSection | Single | Album | Text | PlatformLink | Highlight | AudioBrick;

export { 
  BricksType, 
  getBrickTypeLabel,
   getBrickTypeTableName,  
};