import {
  acceptedFileTypeMap,
  Audio,
  DatabaseMedia,
  Image,
  Media,
  MediaByType,
  MediaType,
  Misc,
  Video,
} from "@models/Medias.ts";

/**
 * Checks if a given UUID is valid.
 * @param uuid - The UUID to be validated.
 * @returns A boolean indicating whether the UUID is valid or not.
 */
export const isUUIDValid = (uuid: string): boolean => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

/**
 * Maps a given filetype to a MediaType.
 *
 * Here we configure the authorized filetypes for each MediaType.
 *
 * @param {string} filetype - The filetype to be mapped.
 * @returns {MediaType | null} The MediaType corresponding to the given filetype. Null if no MediaType is found.
 */
export const getMediaTypeFromFiletype = (
  filetype: string,
): MediaType | null => {
  return Object.keys(acceptedFileTypeMap).find((key) => {
    return acceptedFileTypeMap[key as MediaType].includes(filetype);
  }) as MediaType;
};

/**
 * Flatten the acceptedFileTypeMap into an array of strings, used in the file input accept attribute.
 *
 * @returns {string[]} An array containing all accepted filetypes as strings.
 */
export const convertAcceptFileTypeMapToInputAccept = (): string => {
  return Object.values(acceptedFileTypeMap).flat().join(",");
};

/**
 * Validate and cleanup the object before inserting it into the database.
 *
 * Go through each object key and values, check if it is valid and clean it if necessary (remove all invalid characters).
 *
 * @example validateObjectForDB({ name: "Capture d'écran 2024-03-02 154541.png" }) => { name: "Capture_d'ecran_2024-03-02_154541.png" }
 * @param {any} object - The object to be validated.
 * @returns {any} The validated object.
 */
export const validateObjectForDB = (object: any | string): any | string => {
  if (typeof object === "string") return object.replace(/[^a-zA-Z0-9-_]/g, "_");
  const cleanedObject: any = {};
  for (const [key, value] of Object.entries(object)) {
    if (typeof value === "string") {
      cleanedObject[key] = value.replace(/[^a-zA-Z0-9-_]/g, "_");
    } else {
      cleanedObject[key] = value;
    }
  }
  return cleanedObject;
};

/**
 * Generate an array containing all types `MediaType` as strings.
 *
 * @returns {string[]} An array containing all MediaTypes as strings.
 */
export const getMediaTypesArray = (): string[] => {
  return Object.keys(MediaType).filter((item) => {
    return isNaN(Number(item));
  });
};

// /**
//  * Create a media object.
//  *
//  * @param {MediaType} type - The type of the media.
//  * @param {MediaByType<MediaType>} mediaData - The data of the media.
//  * @returns {MediaByType<MediaType>} The created media object.
//  */
// export function createMedia<T extends MediaType>(type: T, mediaData: MediaByType<T>): MediaByType<T> {
//   return mediaData;
// }

/**
 * Create a default media object from a raw file.
 *
 * @param {MediaType} mediaType - The type of the media.
 * @param {File} rawFile - The raw file to be converted.
 * @returns {Media | Image | Video | Audio | Misc} The created media object.
 * @throws {Error} If the media type is not supported.
 */

export const createDefaultMediaFromRawFile = (
  rawFile: File,
): Media | Image | Video | Audio | Misc => {
  const mediaType = getMediaTypeFromFiletype(rawFile.type);
  if (!mediaType) throw new Error(`Unsupported media type: ${rawFile.type}`);
  const baseMedia: Media = {
    id: "",
    name: rawFile.name,
    display_name: rawFile.name,
    public_src: URL.createObjectURL(rawFile),
    alt: "",
    type: mediaType,
    filesize: rawFile.size,
    extension: rawFile.name.split(".").pop() || "",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  switch (mediaType) {
    case MediaType.Images:
      return {
        ...baseMedia,
        object_fit: { id: 0, value: "best" }, // default value
        cta: { id: 0, label: "", url: "" }, // default value
        type: MediaType.Images,
      };
    case MediaType.Videos:
      return {
        ...baseMedia,
        object_fit: { id: 0, value: "best" }, // default value
        autoplay: false, // default value
        controls: {
          id: 0,
          name: "default",
          play: true,
          progress: true,
          duration: true,
          volume: true,
        }, // default value
        cta: { id: 0, label: "", url: "" }, // default value
        type: MediaType.Videos,
      };
    case MediaType.Audios:
      return {
        ...baseMedia,
        autodetect_source: false, // default value
        controls: {
          id: 0,
          name: "default",
          play: true,
          progress: true,
          duration: true,
          volume: true,
        }, // default value
        type: MediaType.Audios,
      };
    case MediaType.Misc:
      return {
        ...baseMedia,
        type: MediaType.Misc,
      };
  }
};

/**
 * Take as an input the full media object and return a new object with only the attributes from the correct type.
 *
 * @param {Media} media - The media object to be filtered.
 * @returns {Media | Image | Video | Audio | Misc} The filtered media object.
 */
export const filterOutNonValideAttributes = (
  media: DatabaseMedia,
): Media | Image | Video | Audio | Misc | null => {
  const baseMedia = {
    id: media.id,
    name: media.name,
    display_name: media.display_name,
    alt: media.alt || media.name,
    public_src: media.public_src || "",
    filesize: media.filesize || 0,
    extension: media.extension || "",
    updated_at: media.updated_at || new Date().toISOString(),
  };
  switch (media.type) {
    case MediaType.Images:
      return {
        ...baseMedia,
        object_fit: media.object_fit,
        cta: media.cta,
        type: MediaType.Images,
      };
    case MediaType.Videos:
      return {
        ...baseMedia,
        object_fit: media.object_fit,
        autoplay: !!media.autoplay,
        controls: media.controls,
        cta: media.cta,
        type: MediaType.Videos,
      };
    case MediaType.Audios:
      return {
        ...baseMedia,
        autodetect_source: !!media.autodetect_source,
        controls: media.controls,
        type: MediaType.Audios,
      };
    case MediaType.Misc:
      return {
        ...baseMedia,
        type: MediaType.Misc,
      };
  }
  return null;
};
