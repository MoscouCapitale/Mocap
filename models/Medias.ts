interface Media {
  src: string;
  type: string;
  alt: string;
  metadata?: null;
}

type MediaType = "photo" | "video" | "audio" | "misc";

export type { Media, MediaType };
