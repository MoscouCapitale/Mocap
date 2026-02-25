import PocketBase, { LocalAuthStore, RecordOptions, RecordService, CommonOptions, ClientResponseError } from "pocketbase";
import { Content } from "@models/Bricks.ts";
import { IUser } from "@models/Authentication.ts";
import { Context } from "fresh";
import { AuthenticatedAppState } from "./app.ts";

/** Generate a random n length [a-z0-9] identifier. For 36+ length ids we'll see later for impl.
 *
 * @see https://github.com/pocketbase/pocketbase/blob/1dc5e061b8bbc7374e99c3fe6f153db25e71f860/core/db.go#L56
 */
export const generateCollectionEntryId = (length: number = 16): string =>
  crypto
    .randomUUID()
    .replaceAll("-", crypto.randomUUID()[0])
    .substring(0, length - 1);

export const getPB = (token?: string) => {
  if (token) {
    const store = new LocalAuthStore();
    store.save(token);
    return new PocketBase(Deno.env.get("BACKEND_URL"), store);
  } else {
    return new PocketBase(Deno.env.get("BACKEND_URL"));
  }
};

export const apiUrl = (url?: string) => `${Deno.env.get("BACKEND_URL")}/api/${url ?? ""}`;

type PartialCollection<T extends object> = T & Partial<Content>;
type Collection<T extends object> = T & Content;
type CollectionError = {
  code: string | number;
  message: string;
  details?: Record<
    string,
    {
      code: string;
      message: string;
    }
  >;
};

export const isCollectionError = (e: unknown): e is CollectionError =>
  (e as CollectionError).code !== undefined && (e as CollectionError).message !== undefined;

export const handlePBError = (e: unknown): CollectionError => {
  if (e instanceof ClientResponseError) {
    return {
      code: e.status,
      message: e.response.message,
      details: e.response.data,
    };
  } else {
    console.error(e);
    return {
      code: 500,
      message: "Unknown error",
    };
  }
};

export const upsertContent = async <T extends object>(
  service: RecordService<T>,
  data: PartialCollection<T>,
  options?: RecordOptions,
): Promise<Collection<T> | CollectionError> => {
  try {
    if (data.id) {
      return await service.update<Collection<T>>(data.id, data, options);
    } else {
      return await service.create<Collection<T>>(data, options);
    }
  } catch (e) {
    return handlePBError(e);
  }
};

export const deleteContent = async <T extends object>(
  service: RecordService<T>,
  data: Collection<T> | string,
  options?: CommonOptions,
): Promise<boolean | CollectionError> => {
  try {
    return await service.delete(typeof data === "object" ? (data as Collection<T>).id : data, options);
  } catch (e) {
    return handlePBError(e);
  }
};

export const populateUser = <T extends object>(
  data: PartialCollection<T>,
  userData?: IUser | Context<AuthenticatedAppState>,
  keyName: string = "user",
): PartialCollection<T> & { user?: number } => {
  if (userData && "state" in userData) {
    return { ...data, [keyName]: (userData as Context<AuthenticatedAppState>).state.user?.id };
  } else {
    return { ...data, [keyName]: (userData as IUser | undefined)?.id };
  }
};

type PBResponse<T extends object> = Awaited<ReturnType<typeof upsertContent<T>> | ReturnType<typeof deleteContent<T>> | null>;

export const returnPBApiResponse = <C extends Context<any>, T extends object>(ctx: C, data?: PBResponse<T>) => {
  if (isCollectionError(data)) {
    return ctx.json(data, { status: typeof data.code === "number" ? data.code : 500 });
  } else {
    return ctx.json(data, { status: data ? 200 : 204 });
  }
};
