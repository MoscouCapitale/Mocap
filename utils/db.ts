import PocketBase, {
  LocalAuthStore,
  RecordOptions,
  RecordService,
  CommonOptions,
  ClientResponseError,
  RecordFullListOptions,
  RecordListOptions,
  RecordModel,
} from "pocketbase";
import { Content } from "@models/Bricks.ts";
import { IUser } from "@models/Authentication.ts";
import { Context } from "fresh";
import { AuthenticatedAppState } from "./app.ts";
import { omit } from "lodash";

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

export const isContent = (e: unknown): e is Content => !!e && typeof e === "object" && !!(e as Content).id && !!(e as Content).collectionId;

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

//TODO: se renseigner sur le service.getScaffolds

export async function getContent<T extends RecordModel>(service: RecordService<T>, limit: -1, options?: RecordFullListOptions): Promise<T[]>;
export async function getContent<T extends RecordModel>(service: RecordService<T>, limit: 0, options: RecordOptions & { filter: string }): Promise<T | null>;
export async function getContent<T extends RecordModel>(service: RecordService<T>, limit: 1, options: RecordOptions & { id: string }): Promise<T | null>;
export async function getContent<T extends RecordModel>(
  service: RecordService<T>,
  limit: "x",
  options?: RecordListOptions & { page?: number; perPage?: number },
): Promise<T[]>;

export async function getContent<T extends RecordModel>(service: RecordService<T>, limit: -1 | 0 | 1 | "x", options?: RecordFullListOptions & { id?: string }) {
  try {
    switch (limit) {
      case -1: {
        const content = await service.getFullList<T>(options);
        return flattenExpand(content);
      }
      case 0: {
        const content = await service.getFirstListItem(options!.filter!, omit(options!, "filter"));
        return flattenExpand(content);
      }
      case 1: {
        const content = await service.getOne(options!.id!, omit(options!, "id"));
        return flattenExpand(content);
      }
      case "x": {
        const content = await service.getList(options?.page ?? 1, options?.perPage ?? 20, omit(options!, "page", "perPage"));
        //TODO: do I need list ?
        return flattenExpand(content.items);
      }
      default:
        throw new Error("no");
    }
  } catch (e) {
    return handlePBError(e);
  }
}

const flattenExpand = <T extends null | RecordModel | RecordModel[]>(obj: T): T => {
  const flattenContent = (content: null | RecordModel) => {
    // console.log("contenttt", content)
    if (!content?.expand) return content;

    Object.keys(content.expand).forEach((k) => {
      content[k] = content.expand![k];
    });
    delete content.expand;
    return content;
  };

  if (Array.isArray(obj)) return obj.map(flattenContent) as T;
  return flattenContent(obj) as T;
};

//   service: RecordService<T>,
//   /** Main limit, determining the service used.
//    *
//    * - -1: Will return all content `getFullList`
//    * - 0: Will return the first found content `getFirstListItem`
//    * - 1: Will return the content `getOne`
//    * - x: Will return the paginated list of content `getList`
//    */
//   limit: number | -1,
//   data: PartialCollection<T>,
//   options?: RecordOptions,
// ): Promise<Collection<T> | CollectionError> => {
//   try {
//     if (data.id) {
//       return await service.update<Collection<T>>(data.id, data, options);
//     } else {
//       return await service.create<Collection<T>>(data, options);
//     }
//   } catch (e) {
//     return handlePBError(e);
//   }
// };

export const upsertContent = async <T extends object>(
  service: RecordService<T>,
  data: PartialCollection<T>,
  options?: RecordOptions,
): Promise<Collection<T> | CollectionError> => {
  try {
    console.log("Upserting", data)
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
    const res = await service.delete(typeof data === "object" ? data?.id : data, options);
    console.log("delete res: ", res)
    return res;
  } catch (e) {
    return handlePBError(e);
  }
};

/** Prepare a content to be saved in the db.
 *
 * - Normalize the relations
 * - Populate the user, if any
 */
export const prepareContentObject = <T extends RecordModel>(
  initialData: PartialCollection<T>,
  userData?: IUser | Context<AuthenticatedAppState>,
  keyName: string = "user",
): PartialCollection<T> & { user?: number } => {

  const data = Object.entries(initialData).reduce((acc, [key, value]) => {
    if (isContent(value)) acc[key as keyof typeof initialData] = value.id;
    else if (Array.isArray(value) && value.some(isContent)) {
      acc[key as keyof typeof initialData] = value.map((v) => v.id);
    } else acc[key as keyof typeof initialData] = value;

    return acc;
  }, {} as PartialCollection<T>);

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
