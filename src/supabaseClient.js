import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://XXXX.supabase.co';       // ← remplace
const SUPABASE_ANON_KEY = 'XXXX';                       // ← remplace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
