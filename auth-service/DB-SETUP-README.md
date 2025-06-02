# Database Setup for Auth Service

This document explains how to set up the database tables required for the authentication service in your Supabase project.

## Tables Overview

Based on the analysis of the iaai-learnExport project, the following tables have been created:

1. **user_profiles**: Extends the default auth.users table with additional user information
2. **user_settings**: Stores user preferences and settings
3. **user_subscriptions**: Manages user subscription plans
4. **user_sessions**: Tracks user login sessions
5. **password_reset_tokens**: Manages password reset tokens
6. **roles**: Defines user roles (user, admin, creator, consultant)
7. **permissions**: Defines granular permissions
8. **role_permissions**: Maps permissions to roles
9. **user_roles**: Maps users to roles

## Setup Instructions

### Method 1: Using Supabase SQL Editor

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project (with URL: https://xngxszcqtsumxqrkoffn.supabase.co)
3. Go to the SQL Editor tab
4. Create a new query
5. Copy the contents of the `db-setup.sql` file and paste it into the SQL Editor
6. Run the query

### Method 2: Using Supabase CLI

If you have the Supabase CLI installed:

1. Make sure you're logged in to Supabase CLI
2. Run the following command:

```bash
supabase db push --db-url postgresql://postgres:your-password@db.xngxszcqtsumxqrkoffn.supabase.co:5432/postgres -f ./db-setup.sql
```

Replace `your-password` with your database password.

## Table Descriptions

### user_profiles
Extends the default auth.users table with additional user information such as username, full name, avatar URL, bio, etc.

### user_settings
Stores user preferences like notification settings, theme preference, and language.

### user_subscriptions
Manages user subscription plans, including plan type, status, and billing periods.

### user_sessions
Tracks user login sessions with device information and last active timestamp.

### password_reset_tokens
Manages password reset tokens with expiration times.

### roles
Defines user roles in the system:
- user: Regular user with standard permissions
- admin: Administrator with full access
- creator: Content creator with course management permissions
- consultant: Expert consultant with consultation capabilities

### permissions
Defines granular permissions for different actions in the system.

### role_permissions
Maps permissions to roles, defining what each role can do.

### user_roles
Maps users to roles, defining what role(s) each user has.

## Row Level Security (RLS)

The setup includes Row Level Security policies to ensure that users can only access their own data, while admins can access all data as needed.

## Triggers and Functions

The setup includes triggers and functions to:
1. Automatically update the `updated_at` timestamp when records are modified
2. Create user profiles, settings, and assign default roles when new users sign up

## Next Steps

After setting up the database, you can:

1. Test user registration and authentication
2. Implement role-based access control in your application
3. Add additional tables for specific features as needed 