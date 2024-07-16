import { HeroSection, Single, Album, Text, PlateformLink, BricksType } from "@models/Bricks.ts";

// Canva constants
export const CANVA_GUTTER = 20;

type MNodeSize = {
    width: number;
    height: number;
};

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
    PlateformLink?: PlateformLink;
    content: HeroSection | Single | Album | Text | PlateformLink;
    sizes: MNodeSize[];
}

/**
 * The MNode type you save in the database. The content and size are applied on api call.
 */
interface DBMNode {
    id?: number;
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
    PlateformLink?: number;
}

export type { MNode, DBMNode };

export const getAvailableSizes = (type: keyof typeof BricksType): MNodeSize[] => {
    switch (type) {
        case "HeroSection":
            return [];
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
            return [];
    }
};