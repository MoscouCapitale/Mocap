import {
  Session as SupaSession,
  User as SupaUser,
} from "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
import { Error } from "@models/Error.ts";

export type FormType = {
  type: "default" | "signup" | "action_done";
  additional_data?: {
    email?: string;
    password?: string;
    message?: string;
  };
  error?: Error;
};

export type User = SupaUser & {
  user_metadata: UserMetadatas;
};

export type UserMetadatas = {
  isInit: undefined;
} | {
  isInit: true;
  status: UserStatus;
  role: UserRole;
  preferences: UserPreferences;
};

export enum UserRole {
  /** Super Admin. Can do anything. */
  SADMIN = "superadmin",

  /** Admin. Can manage users, site settings, and everything else. */
  ADMIN = "admin",

  /** User. Is default user role. Authorisations to define. */
  USER = "user",
}

export enum UserStatus {
  /** Requested. When a user signed up, and his account is waiting for validation. by an admin */
  RQST = "RQST",

  /** Active. When an admin validated the user's account, and the user has full access to the app. */
  ACTV = "ACTV",

  /** Declined. When an admin declined the user's account request */
  DECL = "DECL",

  /** Blocked. When an admin blocked an active user's account. Can be reverted. */
  BLCK = "BLCK",

  /** Banned. When an admin banned an active user's account. Can't be reverted. This status is not applicable to users. It only used to delete a user. */
  BANN = "BANN",
}

type UserPreferences = {};


export type Session = SupaSession;

export const defaultUserMetadatas: UserMetadatas = {
  isInit: true,
  role: UserRole.USER,
  status: UserStatus.RQST,
  preferences: {},
};