// Database setup script for Supabase
// Run with: node scripts/setup-database.js

const SUPABASE_URL = 'https://lldjyjtamdvekzysoiz.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.log('='.repeat(60));
  console.log('SUPABASE DATABASE SETUP');
  console.log('='.repeat(60));
  console.log('\nPlease run the following SQL scripts in Supabase SQL Editor:');
  console.log('\n1. Open: https://supabase.com/dashboard/project/lldjyjtamdvekzysoiz/sql/new');
  console.log('2. Copy and run the contents of: supabase/schema.sql');
  console.log('3. Copy and run the contents of: supabase/distances.sql');
  console.log('4. (Optional) Run: supabase/sample_data.sql');
  console.log('\n' + '='.repeat(60));
  console.log('\nAlternatively, set SUPABASE_SERVICE_KEY environment variable');
  console.log('and run this script again.\n');
  process.exit(0);
}

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runSQL(filename) {
  const filepath = path.join(process.cwd(), 'supabase', filename);
  const sql = fs.readFileSync(filepath, 'utf8');
  
  console.log(`Running ${filename}...`);
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error(`Error in ${filename}:`, error.message);
    return false;
  }
  
  console.log(`✓ ${filename} completed successfully`);
  return true;
}

async function main() {
  console.log('Setting up Supabase database...\n');
  
  await runSQL('schema.sql');
  await runSQL('distances.sql');
  await runSQL('sample_data.sql');
  
  console.log('\n✓ Database setup complete!');
}

main().catch(console.error);
