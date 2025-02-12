export type EmbedTargets = 
    | "youtube"
    | "spotify"
    | "soundcloud"
    | "deezer"
    | "apple-music"
    | "instagram";

export type EmbedConfig = {
    width?: number;
    height?: number;
};