import { HeroSection, Single, Album, Text, PlatformLink, BricksType } from "@models/Bricks.ts";

// Canva constants
export const CANVA_GUTTER = 20; // The space between nodes
export const NODE_MIN_SIZE = 100; // The minimum width/height of a node

type MNodeSize = {
    width: number;
    height: number;
}

interface MNode {
    id: string;
    type: keyof typeof BricksType;
    x: number;
    y: number;
    width: number;
    height: number;
    locked: boolean;
    HeroSection?: HeroSection;
    Single?: Single;
    Album?: Album;
    Text?: Text;
    PlatformLink?: PlatformLink;
    Highlight?: Highlight;
    content: HeroSection | Single | Album | Text | PlatformLink;
    sizes: MNodeSize[];
    isHighlighted?: boolean;
}

/**
 * The MNode type you save in the database. The content and size are applied on api call.
 */
interface DBMNode {
    id?: string;
    locked?: boolean;
    type: keyof typeof BricksType;
    x: number;
    y: number;
    width: number;
    height: number;
    HeroSection?: number;
    Single?: number;
    Album?: number;
    Text?: number;
    PlatformLink?: number;
    Highlight?: number;
}

export type { MNode, DBMNode };

export const getAvailableSizes = (type: keyof typeof BricksType): MNodeSize[] | null => {
    switch (type) {
        case "HeroSection":
            return null;
        case "Highlight":
            return [{ width: 300, height: 400 }];
        case "Single":
            return [{ width: 300, height: 400 }];
        case "Album":
            return [{ width: 300, height: 400 }];
        case "Text":
            return [{ width: 300, height: 100 }, { width: 400, height: 200 }];
        case "Platform_Link":
            return [{ width: 100, height: 100 }, { width: 200, height: 100 }];
        default:
            console.error(`Type ${type} not recognized in getAvailableSizes`);
            return null;
    }
};