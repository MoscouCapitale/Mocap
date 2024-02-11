interface Media {
  id: string;
  name: string;
  display_name: string;
  public_src?: string;
  alt?: string;
  modified_at?: Date;
  autoplay?: boolean;
  autodetect_source?: boolean;
  cover?: Media;
  controls?: {
    id: number;
    play: boolean;
    progress: boolean;
    duration: boolean;
    volume: boolean;
  }
  cta?: {
    id: number;
    label: string;
    url: string;
  }
  object_fit?: {
    id: number;
    name: string;
  }
  metadata?: null;
}

type MediaType = "photo" | "video" | "audio" | "misc";

export type { Media, MediaType };
