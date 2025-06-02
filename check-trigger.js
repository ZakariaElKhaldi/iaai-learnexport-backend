const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get the connection string from .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_KEY not found in .env file');
  process.exit(1);
}

// Create a Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTrigger() {
  try {
    console.log('Checking trigger function...');
    
    // Check if the handle_new_user function exists using SQL
    const { data: funcData, error: funcError } = await supabase.rpc('check_function_exists', { 
      function_name: 'handle_new_user' 
    });
    
    if (funcError) {
      console.error('Error checking function:', funcError);
      console.log('Adding check_function_exists function to supabase...');
      
      // Create a helper function to check if another function exists
      const { data: createFuncData, error: createFuncError } = await supabase.rpc('exec_sql', {
        sql: `
        CREATE OR REPLACE FUNCTION public.check_function_exists(function_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        AS $$
        DECLARE
          func_exists BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT 1
            FROM pg_proc
            WHERE proname = function_name
          ) INTO func_exists;
          
          RETURN func_exists;
        END;
        $$;
        
        -- Grant access to anon and authenticated roles
        GRANT EXECUTE ON FUNCTION public.check_function_exists(TEXT) TO anon, authenticated;
        `
      });
      
      if (createFuncError) {
        console.error('Error creating helper function:', createFuncError);
        
        // Create the exec_sql function if it doesn't exist
        console.log('Creating exec_sql function...');
        const { data: execSqlData, error: execSqlError } = await supabase.rpc('custom_query', {
          query: `
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
          GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO anon, authenticated;
          `
        });
        
        if (execSqlError) {
          console.error('Error creating exec_sql function:', execSqlError);
          console.log('Unable to automatically fix the issue. Please run this SQL in the Supabase SQL editor:');
          console.log(`
          -- Create the exec_sql function
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
          GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO anon, authenticated;
          
          -- Check if the handle_new_user function exists
          SELECT EXISTS (
            SELECT 1
            FROM pg_proc
            WHERE proname = 'handle_new_user'
          );`);
          console.log('\nAlso, please check the handle_new_user function by running:');
          console.log(`
          -- Create or replace the handle_new_user function
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS TRIGGER AS $$
          BEGIN
              -- Create user profile
              INSERT INTO public.user_profiles (id, email, username, full_name)
              VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'name');
              
              -- Create user settings
              INSERT INTO public.user_settings (id)
              VALUES (NEW.id);
              
              -- Assign default user role
              INSERT INTO public.user_roles (user_id, role_id)
              SELECT NEW.id, r.id FROM public.roles r WHERE r.name = 'user';
              
              RETURN NEW;
          END;
          $$ LANGUAGE plpgsql;
          
          -- Check if the trigger exists and create it if not
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1
              FROM pg_trigger
              WHERE tgname = 'on_auth_user_created'
            ) THEN
              CREATE TRIGGER on_auth_user_created
              AFTER INSERT ON auth.users
              FOR EACH ROW
              EXECUTE FUNCTION public.handle_new_user();
            END IF;
          END
          $$;
          `);
        }
      } else {
        console.log('Successfully created check_function_exists function!');
      }
    } else {
      if (funcData) {
        console.log('✅ handle_new_user function exists!');
      } else {
        console.log('❌ handle_new_user function does not exist!');
      }
    }
    
    // Test registration again
    console.log('\nTesting user registration with a new email...');
    const testEmail = `test${Date.now()}@example.com`;
    const { data: user, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'password123',
      options: {
        data: {
          name: 'Test User',
        }
      }
    });
    
    if (signupError) {
      console.error('Registration error:', signupError);
    } else {
      console.log('Registration attempt completed:', user);
      
      // Check if the user profile was created
      console.log(`\nChecking if user profile was created for ${testEmail}...`);
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', testEmail)
        .limit(1);
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      } else if (profile && profile.length > 0) {
        console.log('✅ User profile created successfully:', profile[0]);
      } else {
        console.log('❌ User profile not found, trigger may not be working properly.');
      }
    }
  } catch (error) {
    console.error('Error checking trigger:', error);
  }
}

checkTrigger(); 