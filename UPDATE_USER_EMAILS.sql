-- Update existing records to populate user_email from auth.users table
-- Run this in Supabase SQL Editor to backfill email addresses

-- Update custom_phrases table
UPDATE custom_phrases cp
SET user_email = au.email
FROM auth.users au
WHERE cp.user_id = au.id
AND cp.user_email IS NULL;

-- Update conversation_logs table
UPDATE conversation_logs cl
SET user_email = au.email
FROM auth.users au
WHERE cl.user_id = au.id
AND cl.user_email IS NULL;

-- Verify the updates
SELECT 'custom_phrases' as table_name, COUNT(*) as updated_count
FROM custom_phrases
WHERE user_email IS NOT NULL
UNION ALL
SELECT 'conversation_logs' as table_name, COUNT(*) as updated_count
FROM conversation_logs
WHERE user_email IS NOT NULL;
