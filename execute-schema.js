const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
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

async function executeSchema() {
  try {
    console.log('Reading schema file...');
    const schemaSQL = fs.readFileSync('./auth-service/db-setup.sql', 'utf8');
    
    // Extract one section at a time to make debugging easier
    console.log('Executing handle_new_user function and trigger...');
    
    // First drop existing trigger and function
    await executeSQL('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
    await executeSQL('DROP FUNCTION IF EXISTS public.handle_new_user();');
    
    // Create the handle_new_user function
    const handleNewUserSQL = `
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    DECLARE
        username_val TEXT;
        name_val TEXT;
    BEGIN
        -- Extract the username and name safely
        username_val := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
        name_val := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
        
        -- Create user profile
        INSERT INTO public.user_profiles (id, email, username, full_name)
        VALUES (NEW.id, NEW.email, username_val, name_val);
        
        -- Create user settings
        INSERT INTO public.user_settings (id)
        VALUES (NEW.id);
        
        -- Assign default user role
        INSERT INTO public.user_roles (user_id, role_id)
        SELECT NEW.id, r.id FROM public.roles r WHERE r.name = 'user';
        
        RETURN NEW;
    EXCEPTION
        WHEN others THEN
            -- Log the error
            RAISE NOTICE 'Error in handle_new_user trigger: %', SQLERRM;
            
            -- Still return NEW to allow the user creation
            RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    await executeSQL(handleNewUserSQL);
    
    // Create the trigger
    const triggerSQL = `
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
    `;
    
    await executeSQL(triggerSQL);
    
    // Grant execute permissions
    await executeSQL('GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;');
    
    // Now test the user registration
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
      console.log('Registration successful:', user);
      
      // Check if the user profile was created
      console.log(`\nChecking if user profile was created for ${testEmail}...`);
      setTimeout(async () => {
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
      }, 2000); // Wait a bit for the trigger to execute
    }
  } catch (error) {
    console.error('Error executing schema:', error);
  }
}

async function executeSQL(sql) {
  try {
    console.log(`Executing SQL: ${sql.substring(0, 50)}...`);
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sql
    });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    } else {
      console.log('✅ SQL executed successfully');
      return true;
    }
  } catch (err) {
    console.error('Exception executing SQL:', err);
    return false;
  }
}

executeSchema(); 