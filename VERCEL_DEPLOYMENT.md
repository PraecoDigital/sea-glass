# Vercel Deployment Guide

## Prerequisites
- Vercel account
- Supabase project configured
- Database table created (see SUPABASE_SETUP.md)

## Deployment Steps

### 1. Connect to Vercel
1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Deploy the application

### 2. Configure Environment Variables
**This is the most common cause of "failed to fetch" errors!**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   ```
   REACT_APP_SUPABASE_URL=https://iwjsiztyspbggbaycyot.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3anNpenR5c3BiZ2diYXljeW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODM1OTMsImV4cCI6MjA3MjE1OTU5M30.EuDJIHw5OU7ue1wZEhMO9AxlCPTt4QKgDi4ncH61grI
   ```
4. **Important**: Set the environment to **Production** (and Preview if needed)
5. Redeploy your application

### 3. Configure Supabase CORS
1. Go to your Supabase dashboard
2. Navigate to **Settings** → **API**
3. Add your Vercel domain to **Additional Allowed Origins**:
   ```
   https://your-app-name.vercel.app
   https://your-app-name.vercel.app/*
   ```

### 4. Verify Database Setup
1. Run the SQL from SUPABASE_SETUP.md in your Supabase SQL editor
2. Ensure the `user_budgets` table exists with proper RLS policies

## Troubleshooting "Failed to Fetch" Error

### Check Browser Console
1. Open your deployed app
2. Open browser developer tools (F12)
3. Check the Console tab for specific error messages
4. Look for connection test logs

### Common Error Messages & Solutions

#### "Network Error" or "Failed to fetch"
- **Cause**: Environment variables not set in Vercel
- **Solution**: Add environment variables and redeploy

#### "CORS error"
- **Cause**: Vercel domain not in Supabase CORS settings
- **Solution**: Add Vercel domain to Supabase CORS origins

#### "RLS policy violation"
- **Cause**: Row Level Security policies not set up
- **Solution**: Run the SQL from SUPABASE_SETUP.md

#### "Table does not exist"
- **Cause**: Database table not created
- **Solution**: Create the `user_budgets` table in Supabase

### Debug Steps
1. Check if environment variables are loaded:
   - Open browser console
   - Look for "Testing Supabase connection..." logs
   - Verify URL and Anon Key are present

2. Test Supabase connection:
   - The app now includes connection testing
   - Check console for connection test results

3. Verify table access:
   - Check if RLS policies are working
   - Ensure user authentication is working

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_SUPABASE_URL` | `https://iwjsiztyspbggbaycyot.supabase.co` | Your Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase anon key |

## Security Best Practices

### Environment Variables Security
- ✅ **Never commit environment variables to Git**
- ✅ **Use Vercel's environment variable system** for production
- ✅ **The anon key is safe to expose** - it's designed for client-side use
- ✅ **Detailed logging is disabled in production** to prevent information leakage

### Supabase Security
- ✅ **Row Level Security (RLS)** ensures users can only access their own data
- ✅ **Anon key has limited permissions** - only what you define in RLS policies
- ✅ **Use service role key only on the server-side** (never in client code)

### Additional Security Measures
- ✅ **CORS properly configured** to prevent unauthorized access
- ✅ **Error messages sanitized** to prevent information leakage
- ✅ **Development-only logging** prevents sensitive data exposure in production

## Support
If you're still experiencing issues:
1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase CORS settings include your Vercel domain
4. Confirm the database table and policies are set up correctly
