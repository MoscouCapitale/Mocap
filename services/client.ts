import { createClient } from 'supabase';

const supa = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_KEY'));

export default supa;