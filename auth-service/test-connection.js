const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get the connection string from .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY not found in .env file');
  process.exit(1);
}

console.log('Attempting to connect to Supabase at:', supabaseUrl);

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Try to get the current user to test the connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Connection error:', error.message);
      return;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Session data:', data);
    
    // Try to fetch some data from a public table if available
    try {
      const { data: tableData, error: tableError } = await supabase
        .from('public_table')
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.log('Note: Could not fetch from public_table:', tableError.message);
        console.log('This is normal if the table doesn\'t exist or you don\'t have access.');
      } else {
        console.log('Successfully fetched data from public_table:', tableData);
      }
    } catch (tableError) {
      console.log('Note: Could not fetch from public_table. This is normal if the table doesn\'t exist.');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection(); 