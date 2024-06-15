export const getBaseUrl = () => {
    return !globalThis ? Deno.env.get("BASE_URL") : 'http://localhost:8000';
}