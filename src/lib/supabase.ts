import { createClient } from '@supabase/supabase-js';

// Fallback values for GitHub Pages deployment
// These are publishable (anon) keys - safe for frontend use
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://llldjyjtamdvekzysoiz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qeTecuK3ZJQGloLjQ_gihQ_l3JyRygP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
