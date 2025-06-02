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

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Try to query each table we expect to exist
    const tablesToCheck = [
      'user_profiles',
      'user_settings',
      'user_subscriptions',
      'user_sessions', 
      'password_reset_tokens',
      'roles',
      'permissions',
      'role_permissions',
      'user_roles'
    ];
    
    for (const tableName of tablesToCheck) {
      console.log(`Checking table: ${tableName}`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${tableName} error:`, error.message);
      } else {
        console.log(`✅ Table ${tableName} exists!`);
      }
    }
    
    // Try to register a test user and see the detailed error
    console.log('\nTesting user registration...');
    const { data: user, error: signupError } = await supabase.auth.signUp({
      email: 'test@example.com',
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
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkTables(); 