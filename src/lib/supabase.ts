import { createClient } from '@supabase/supabase-js';

// Fallback values for GitHub Pages deployment
// These are publishable (anon) keys - safe for frontend use
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://llldjyjtamdvekzysoiz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbGRqeWp0YW1kdmVrenlzb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTA2ODYsImV4cCI6MjA4NDY4NjY4Nn0.dX_AxumEVQSXKTZmwHrCsgbNk-LB0RHuj0kwVPVfmeM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
