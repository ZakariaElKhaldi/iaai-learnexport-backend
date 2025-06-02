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

async function main() {
  try {
    console.log('Checking Supabase restrictions...');
    
    // First try with a test email to diagnose the issue
    console.log('Testing user registration with a valid email...');
    const testEmail = `user${Date.now()}@gmail.com`;
    
    const { data: user, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'Password123!',
      options: {
        data: {
          name: 'Test User',
        }
      }
    });
    
    if (signupError) {
      console.error('Registration error with valid email format:', signupError);
    } else {
      console.log('Registration successful with valid email format:', user);
    }
    
    // Check the project settings
    console.log('\nPlease note: You may need to check your Supabase project settings:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Authentication > Providers');
    console.log('3. Ensure "Email provider" is enabled');
    console.log('4. Check if you have any domain restrictions for registration');
    console.log('5. In "Email templates", verify your Supabase project has proper email templates set up');
    console.log('6. You might need to add your test domains to an allowlist in the Supabase dashboard');
    
    console.log('\nAlso, try using a real email domain like gmail.com instead of example.com');
    
  } catch (error) {
    console.error('Error testing Supabase:', error);
  }
}

main(); 