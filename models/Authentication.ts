import { Error } from "@models/Error.ts";
import { PartialBy } from "./type-utils.ts";

//FIXME: "https://esm.sh/v116/@supabase/gotrue-js@2.23.0/dist/module/index.js";
type SupaSession = any;

export type FormType = {
  type: "default" | "signin" | "signup" | "action_done";
  toast?: {
    title?: string,
    message: string
    // TODO: add toast types
  },
  //TODO: remove message and use generic for custom datas
  additional_data?: {
    email?: string;
    password?: string;
    message?: string;
  };
  error?: Error;
};

export type FormResponse =
  | {
      data: FormType;
    }
  | Response;

export interface User {
  id: string;
  password?: string;
  tokenKey: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  role: UserRole;
  status: UserStatus;
  preferences?: UserPreferences;
  created: Date;
  updated: Date;
}

export interface NewUser extends PartialBy<User, "id" | "tokenKey" | "verified" | "created" | "updated"> {
  passwordConfirm: string;
}

export type UserMetadatas =
  | {
      isInit: undefined;
    }
  | {
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
