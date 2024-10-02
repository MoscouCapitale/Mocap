import { FetchableSettingsKeys, getSettings } from "@services/settings.ts";
import { FormField } from "@models/Form.ts";

type cachedSettings = {
  [key in FetchableSettingsKeys]: {
    data: Record<FormField["name"], string> | null;
    lastUpdated: number; // timestamp since epoch
  };
};

const cachedSettings: cachedSettings = {
  main: {
    data: null,
    lastUpdated: 0,
  },
  styles: {
    data: null,
    lastUpdated: 0,
  },
  medias: {
    data: null,
    lastUpdated: 0,
  },
  misc: {
    data: null,
    lastUpdated: 0,
  },
};

/** The time to refresh the cache */
const TIME_DELTA = 86400000; // 24 hours

export const getCachedSettings = async (
  field: FetchableSettingsKeys,
): Promise<Record<FormField["name"], string> | null> => {
  if ((Date.now() - cachedSettings[field].lastUpdated) < TIME_DELTA) {
    return cachedSettings[field].data;
  } else {
    const data = await getSettings(field);
    cachedSettings[field].data = data ?? {};
    cachedSettings[field].lastUpdated = Date.now();
    return data;
  }
};
