const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get the connection string from .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY not found in .env file');
  process.exit(1);
}

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createExecSqlFunction() {
  try {
    console.log('Creating exec_sql function in Supabase...');
    
    // First try with RPC to see if the function exists
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'SELECT 1;'
    });
    
    if (error && error.message.includes('could not find function')) {
      // Function doesn't exist, create it using direct SQL
      const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
      
      -- Grant access to anon and authenticated roles
      GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role, anon, authenticated;
      `;
      
      // Execute SQL directly using REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({ sql: createFunctionSQL })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating exec_sql function:', errorData);
        console.log('Please run this SQL in the Supabase SQL Editor:');
        console.log(createFunctionSQL);
      } else {
        console.log('✅ exec_sql function created successfully!');
      }
    } else if (error) {
      console.error('Unexpected error checking exec_sql function:', error);
    } else {
      console.log('✅ exec_sql function already exists!');
    }
  } catch (error) {
    console.error('Error creating exec_sql function:', error);
    console.log('Please manually run this SQL in the Supabase SQL Editor:');
    console.log(`
    CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
    
    -- Grant access to anon and authenticated roles
    GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role, anon, authenticated;
    `);
  }
}

createExecSqlFunction(); 