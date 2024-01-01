export type Error = {
    code: number;
    message: string;
    targetElement?: string | HTMLElement;
}