import PocketBase, { LocalAuthStore } from 'pocketbase';

/** Generate a random n length [a-z0-9] identifier. For 36+ length ids we'll see later for impl.
 * 
 * @see https://github.com/pocketbase/pocketbase/blob/1dc5e061b8bbc7374e99c3fe6f153db25e71f860/core/db.go#L56
 */
export const generateCollectionEntryId = (length: number = 16): string => crypto.randomUUID().replaceAll('-', 'a').substring(0, length - 1);

export const getPB = (token?: string) => {
    if (token) {
        const store = new LocalAuthStore()
        store.save(token);
        return new PocketBase(Deno.env.get("BACKEND_URL"), store);
    } else {
        return new PocketBase(Deno.env.get("BACKEND_URL"));
    }
}

export const apiUrl = (url?: string) => `${Deno.env.get("BACKEND_URL")}/api/${url ?? ''}`