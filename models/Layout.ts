type NavItemType = {
    name: string;
    path: string;
    label?: string;
    // deno-lint-ignore no-explicit-any
    icon?: any;
    active?: boolean;
}

export type {
    NavItemType
}