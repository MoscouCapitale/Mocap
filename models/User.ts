type UserRequestType = {
    email: string;
    note: string;
}

type Role = 'anon' | 'authenticated' | 'mocap_admin' | 'supabase_admin';

export type {
    UserRequestType,
    Role,
}
