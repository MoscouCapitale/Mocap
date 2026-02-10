import ky from "ky";
import { apiUrl } from "./db.ts";

export const isEmailAvailable = async (email: string) => {
  const res = await ky.get(apiUrl(`user/email/${encodeURIComponent(email)}`));
  return res.status === 204;
};
