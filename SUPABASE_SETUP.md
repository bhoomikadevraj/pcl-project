# Supabase Integration Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - Name: `sign-sync` (or any name)
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Update Configuration

Open `js/supabase-config.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Paste your Project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Paste your anon key
```

### 4. Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Create custom_phrases table
CREATE TABLE custom_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phrase TEXT NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT DEFAULT '💬',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE custom_phrases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own phrases
CREATE POLICY "Users can view own phrases"
  ON custom_phrases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own phrases
CREATE POLICY "Users can insert own phrases"
  ON custom_phrases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own phrases
CREATE POLICY "Users can update own phrases"
  ON custom_phrases
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own phrases
CREATE POLICY "Users can delete own phrases"
  ON custom_phrases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX custom_phrases_user_id_idx ON custom_phrases(user_id);
CREATE INDEX custom_phrases_created_at_idx ON custom_phrases(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_phrases_updated_at
  BEFORE UPDATE ON custom_phrases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5. Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Optional: Disable email confirmation for testing:
   - Go to **Authentication** → **Settings**
   - Scroll to **Email Auth**
   - Toggle off **"Enable email confirmations"** (for development only)

### 6. Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. You should see the **Sign In/Sign Up** form in the top right
4. Create an account with any email
5. Sign in and try saving a custom phrase!

## ✨ Features Enabled

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Custom phrases saved to database per user
- ✅ Real-time sync across tabs/devices
- ✅ Secure with Row Level Security (RLS)
- ✅ Custom phrase feature locked behind authentication

## 🔒 Security Features

1. **Row Level Security (RLS)**: Users can only access their own phrases
2. **Authentication Required**: Custom phrases require login
3. **Input Sanitization**: All user input is sanitized
4. **Secure Storage**: Credentials never exposed in frontend

## 📊 Database Schema

```
custom_phrases
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key to auth.users)
├── phrase (TEXT, Not Null)
├── label (TEXT, Not Null)
├── emoji (TEXT, Default '💬')
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🎯 How It Works

### For Non-Authenticated Users:
- See default phrase tiles (Hello, Yes, No, etc.)
- **Cannot** access Custom Phrase feature
- Prompted to sign in when clicking Custom Phrase

### For Authenticated Users:
- See default phrase tiles + their saved custom phrases
- **Can** create and save custom phrases
- Custom phrases sync automatically
- Phrases persist across sessions

## 🛠️ Troubleshooting

### Issue: "Failed to load custom phrases"
- Check Supabase credentials in `js/supabase-config.js`
- Verify database table exists
- Check browser console for errors

### Issue: Email confirmation required
- Disable email confirmation in Supabase settings (for development)
- Or check email for confirmation link

### Issue: "Sign in failed"
- Verify email/password are correct
- Check if email confirmation is required
- Look at browser console for specific error

### Issue: Custom phrases not saving
- Make sure you're signed in
- Check RLS policies are created correctly
- Verify `user_id` matches authenticated user

## 🚀 Production Deployment

Before deploying to production:

1. **Enable email confirmation** in Supabase
2. **Add your domain** to Supabase allowed origins
3. **Set up custom email templates** (optional)
4. **Never commit** your Supabase credentials to Git
5. **Use environment variables** for credentials in production

## 📝 Next Steps

- Add profile pictures for users
- Add ability to edit/delete custom phrases from UI
- Add phrase categories
- Add phrase sharing between users
- Add offline support with service worker
