import { IUser } from "./Authentication.ts";
import { Audio, Image, MediaControls, MediaCTA, MediaObjectFit, Video } from "./Medias.ts";
import { TableNames } from "./database.ts";
import { RequiredBy } from "./type-utils.ts";

/** Base interface of a content in the db */
export interface Content {
  /** String id of the content */
  id: string;
  //TODO: check types
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export enum EAlbumType {
  single = "Single",
  album = "Album",
  EP = "EP",
}

type RelationContent<T extends { id: string } | { id: string }[]> = T extends (infer U)[]
  ? U extends { id: string }
    ? RequiredBy<Partial<U>, "id">[]
    : never
  : T extends { id: string }
    ? RequiredBy<Partial<T>, "id">
    : never;

type UserRelation = RelationContent<IUser>;

export interface IAlbum extends Content {
  name: string;
  type: EAlbumType;
  user: UserRelation;
  tracks?: RelationContent<ITrack[]>;
}

export interface IArtist extends Content {
  name: string;
  user: UserRelation;
}

export interface ILink extends Content {
  name: string;
  url: string;
  icon_url?: string;
  title?: string;
  user: UserRelation;
}

export interface ITrack extends Content {
  name: string;
  user: UserRelation;
  artists?: RelationContent<IArtist>;
}

export enum EBrickType {
  Album = "album",
  Highlight = "highlight",
  Text = "text",
}

export const getBrickTypeLabel = (t: EBrickType) => Object.entries(EBrickType).find(([_, v]) => v === t)?.[0] ?? '';

interface IBaseBrick extends Content {
  title: string;
  user: UserRelation;
  settings: {
    hoverable: boolean;
    // Le 'média' sera remplacé par une intégration spécifiée dans le 'Lien' (Spotify, SoundCloud, etc).
    is_embed?: boolean;
  };
}

/** A brick representing an album, single, ep */
export interface IBrickAlbum extends IBaseBrick {
  type: EBrickType.Album;
  album: IAlbum;
  link?: ILink;
  media?: IMedia;
  controls?: MediaControls;
}

/** A brick containing a media. Has a variant for hero section  */
export interface IBrickHighlight extends IBaseBrick {
  type: EBrickType.Highlight;
  subtitle?: string;
  media: IMedia;
  controls: MediaControls;
  link?: RelationContent<ILink>;
  variant: "default" | "hero";
  style: "scrolling-hero";
}

/** A brick containng a simple text */
export interface IBrickText extends IBaseBrick {
  type: EBrickType.Text;
  text: string;
  media?: IMedia;
}

export type IBrick<T extends EBrickType | null = null> = T extends EBrickType.Album
  ? EBrickType.Album
  : T extends EBrickType.Highlight
    ? EBrickType.Highlight
    : T extends EBrickType.Text
      ? EBrickType.Text
      : IBrickAlbum | IBrickHighlight | IBrickText;

// FIXME: use media table
export type IMedia = string;

export interface INode extends Content {
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
  brick: RelationContent<IBrick>;
  user: UserRelation;
}

export interface ISettings extends Content {
  user: UserRelation;
  main: {
    api_tidal: string;
    api_deezer: string;
    api_spotify: string;
    website_url: string;
    website_icon: string;
    website_title: string;
    api_soundcloud: string;
    api_amazon_music: string;
    website_keywords: string[];
    api_youtube_music: string;
    email_admin_sender: string;
    email_contact_sender: string;
    email_default_sender: string;
    email_logging_sender: string;
    email_admin_recipient: string;
    email_contact_recipient: string;
    email_logging_recipient: string;
    email_usercreate_sender: string;
    email_usercreate_recipient: string;
  };
  media: {
    media_lazyload: string;
    media_max_size_mb: string;
    media_auto_optimize: string;
    media_max_size_height: string;
  };
  style: {
    style_font_main: string;
    style_color_auto: string;
    style_color_main: string;
    style_theme_toggle: string;
    style_font_secondary: string;
    style_color_secondary: string;
  };
  misc: {};
}

// ============ OLD - TO RM ============
//
// ============ OLD - TO RM ============

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
}

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
};

export type availBricks = HeroSection | Single | Album | Text | PlatformLink | Highlight | AudioBrick;

export { BricksType, getBrickTypeTableName };
