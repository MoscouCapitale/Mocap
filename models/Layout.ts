import { IconType } from "@utils/icons.ts";

type NavItemType = {
    name: string;
    path: string;
    label?: string;
    // deno-lint-ignore no-explicit-any
    icon?: IconType;
    active?: boolean;
    badge?: {
        count: number;
        color?: string;
    }
}

export type {
    NavItemType
}