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
