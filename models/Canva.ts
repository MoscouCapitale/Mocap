import { HeroSection, Single, Album, Text, PlateformLink } from "@models/Bricks.ts";

interface MNode {
    id: string;
    content?: HeroSection | Single | Album | Text | PlateformLink;
    x: number;
    y: number;
    width: number;
    height: number;
    locked: boolean;
}

export type { MNode };