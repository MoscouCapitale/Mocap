import { Database } from "@models/database.ts";

type UserRequestType = {
    email: string;
    note: string;
}

type RequestedUser = Database["public"]["Tables"]["Users"]["Row"] & { email?: string; created_at?: string; role?: Role; };

type Role = 'anon' | 'authenticated' | 'mocap_admin' | 'supabase_admin';

export type {
    UserRequestType,
    Role,
    RequestedUser,
}
