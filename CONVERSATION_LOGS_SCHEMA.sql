-- Conversation Logs Table for Sign Sync
-- This table stores conversation history for signed-in users

-- Create the conversation_logs table
CREATE TABLE IF NOT EXISTS conversation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phrase TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE conversation_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own logs
CREATE POLICY "Users can view own conversation logs"
  ON conversation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert own conversation logs"
  ON conversation_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own logs
CREATE POLICY "Users can delete own conversation logs"
  ON conversation_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS conversation_logs_user_id_idx ON conversation_logs(user_id);
CREATE INDEX IF NOT EXISTS conversation_logs_timestamp_idx ON conversation_logs(timestamp DESC);

-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire SQL script
-- 4. Click "Run" to create the table and policies
-- 5. Verify the table was created in the Table Editor
