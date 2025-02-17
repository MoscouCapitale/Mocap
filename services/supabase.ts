import { AuthError, createClient } from "supabase";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { decodeBase64 as decode, encodeBase64 as encode } from "$std/encoding/base64.ts";
import { Database } from "@models/database.ts";
import { User, UserMetadatas } from "@models/Authentication.ts";

// TODO: find a way to avoid using the service key
export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL") as string,
  Deno.env.get("SUPABASE_KEY") as string,
);
export const supabaseSSR = (req: Request, res: Response) =>
  createClient(
    Deno.env.get("SUPABASE_URL") as string,
    Deno.env.get("SUPABASE_KEY") as string,
    {
      auth: {
        detectSessionInUrl: false,
        flowType: "pkce",
        storageKey: "pkce",
        storage: {
          setItem: (key: string, value: string) => {
            const val = encode(value);
            setCookie(res.headers, {
              name: key,
              value: val,
              sameSite: "Lax",
              maxAge: 60 * 60 * 24 * 7 * 1000,
              path: "/",
            });
          },
          getItem: (key: string) => {
            const cok = getCookies(req.headers);
            const val = cok[key];
            if (!val) {
              return null;
            }
            const decoded = decode(val);
            const decodedStr = new TextDecoder("utf-8").decode(decoded);
            return decodedStr;
          },
          removeItem: (key: string) => {
            setCookie(res.headers, {
              name: key,
              value: "",
              sameSite: "Lax",
              expires: new Date(0),
              path: "/",
            });
          },
        },
      },
    },
  );

export const getUserFromSession = async (request: Request): Promise<{
  user: User | null;
  error: AuthError | null;
}> => {
  const cookies = getCookies(request.headers);

  const access = cookies.token;

  if (access) {
    const { error, data } = await supabase.auth.getUser(access);
    if (error) {
      // Generaly, the error is because the token is expired
      return { user: null, error: error };
    }
    return { user: data.user as User, error: null };
  }

  // If no access, it means first connexion. Return nothing
  return { user: null, error: null };
};

export const accessTokenExpired = (request: Request) => {
  const cookies = getCookies(request.headers);
  const token = cookies.token;
  if (!token) return true;
  const jwt = token.split(".")[1];
  const decoded = JSON.parse(atob(jwt));
  const exp = decoded.exp;
  const now = new Date().getTime() / 1000;
  return exp < now;
};

export const refreshAccessToken = async (request: Request) => {
  const cookies = getCookies(request.headers);

  const refresh = cookies.refresh;

  if (refresh) {
    const { data } = await supabase.auth.refreshSession({
      refresh_token: refresh,
    });
    return data;
  }

  return null;
};

export const setAuthCookie = (
  response: Response,
  refresh: string,
  access: string,
) => {
  const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
  setCookie(response.headers, {
    name: "token",
    value: access,
    path: "/",
    httpOnly: true,
    expires,
  });
  setCookie(response.headers, {
    name: "refresh",
    value: refresh,
    path: "/",
    httpOnly: true,
    expires,
  });
};

export const updateUserMetadata = async (user_id: User["id"], metadata: Partial<UserMetadatas>): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(user_id);

    if (!error) {
      const { data: newUser } = await supabase.auth.admin.updateUserById(user_id, {
        user_metadata: { ...data.user.user_metadata, ...metadata },
      });
      // @ts-ignore - return a user, or null if not found
      return newUser.user as User ?? null;
    }
    throw new Error(error.message);
  } catch (e) {
    console.error("Error updating user metadata", e);
    return null;
  }
};
