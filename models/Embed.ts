export type EmbedTargets = 
    | "youtube"
    | "spotify"
    | "soundcloud"
    | "deezer"
    | "apple-music"
    | "instagram"
    | "twitter";

export type EmbedConfig = {
    width?: number;
    height?: number;
};