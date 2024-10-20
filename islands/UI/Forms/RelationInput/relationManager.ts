import { Artist, Platform, PlatformLink, Track } from "@models/Bricks.ts";
import { MediaControls, MediaCTA } from "@models/Medias.ts";
import { AvailableFormRelation } from "@models/Form.ts";

export type AvailableAttributes = MediaControls | MediaCTA | PlatformLink | Platform | Track | Artist;

// Prefix for local storage
const LOCAL_PREFIX = "moc_attr_";

/**
 * Get all entries of the given object attribute.
 *
 * @param {AvailableFormRelation} attribute - The attribute to fetch
 * @param {boolean} refetch - If the data should be refetched from the server. If false, the data will be fetched from the local storage.
 * @returns
 */
export async function getAttributes(
  attribute: AvailableFormRelation,
  refetch?: true | "auto",
): Promise<AvailableAttributes[]> {
  if (!refetch || refetch === "auto") {
    const attr = fetchAttributeFromLocal(attribute);
    if (!attr.length && refetch === "auto") {
      const data = await fetchAttributeFromDB(attribute);
      setAttributeInLocal(attribute, data);
      return data;
    } else return attr;
  }
  const data = await fetchAttributeFromDB(attribute);
  setAttributeInLocal(attribute, data);
  return data;
}

const fetchAttributeFromDB = async (attribute: AvailableFormRelation): Promise<AvailableAttributes[]> => {
  const res = await fetch(`/api/content/attributes/${attribute}`);
  if (res.status !== 204) return res.json();
  return [];
};

const isLocalStorageAvailable = () => typeof localStorage !== "undefined" && localStorage !== null;

const fetchAttributeFromLocal = (attribute: AvailableFormRelation): AvailableAttributes[] => {
  if (!isLocalStorageAvailable()) return [];
  return JSON.parse(localStorage.getItem(`${LOCAL_PREFIX}${attribute}`) || "[]");
};

const setAttributeInLocal = (attribute: AvailableFormRelation, data: AvailableAttributes[]) => {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(`${LOCAL_PREFIX}${attribute}`, JSON.stringify(data));
};
