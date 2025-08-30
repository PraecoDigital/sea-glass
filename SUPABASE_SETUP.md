# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Database Setup

### 1. Create the user_budgets table

Run this SQL in your Supabase SQL editor:

```sql
-- Create the user_budgets table
CREATE TABLE user_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  budget_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_budgets_user_id ON user_budgets(user_id);
CREATE INDEX idx_user_budgets_updated_at ON user_budgets(updated_at);

-- Enable Row Level Security
ALTER TABLE user_budgets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only access their own data
CREATE POLICY "Users can view own budget data" ON user_budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget data" ON user_budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget data" ON user_budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget data" ON user_budgets
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL and redirect URLs
3. Enable email confirmations if desired

## Environment Variables

Create a `.env` file in your project root with:

```
REACT_APP_SUPABASE_URL=https://iwjsiztyspbggbaycyot.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3anNpenR5c3BiZ2diYXljeW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODM1OTMsImV4cCI6MjA3MjE1OTU5M30.EuDJIHw5OU7ue1wZEhMO9AxlCPTt4QKgDi4ncH61grI
```

You can find these values in your Supabase project settings under API.

## Features Added

### 1. User Authentication
- Sign up with email and password
- Sign in with existing credentials
- Sign out functionality
- Persistent authentication state

### 2. Data Persistence
- User data is stored in Supabase database
- Automatic sync between local storage and cloud
- Fallback to local storage if cloud is unavailable

### 3. Benchmark Percentages
- Living Expenses: 70% benchmark
- Liabilities: 20% benchmark  
- Investments: 10% benchmark
- Visual comparison between user allocations and benchmarks
- Progress bars and status indicators
- Color-coded feedback (green for good, red for over budget)

### 4. Enhanced Dashboard
- Real-time benchmark comparisons
- Visual progress indicators
- Status messages showing how far above/below benchmarks
- Responsive design for all screen sizes

## Usage

1. Users can sign up or sign in
2. Complete onboarding to set up initial budget
3. View benchmark comparisons on the dashboard
4. Track spending against recommended percentages
5. Get visual feedback on financial health

## Security

- Row Level Security ensures users can only access their own data
- Authentication required for cloud data access
- Local storage fallback for offline functionality
