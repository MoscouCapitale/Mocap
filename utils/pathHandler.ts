export const getBaseUrl = () => {
    // If server side, get env variable
    if (!globalThis || !globalThis.window) {
        return Deno.env.get("BASE_URL") || "";
    } else {
        // If client side, get the base url from the window
        return globalThis.location.origin;
    }
}