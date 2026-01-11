# 🚀 Quick Start - Supabase Integration

## ⚡ 5-Minute Setup

### Step 1: Create Supabase Project (2 min)
1. Go to https://supabase.com
2. Click "New Project"
3. Enter name and password
4. Wait for project creation

### Step 2: Get Credentials (1 min)
1. Dashboard → Settings → API
2. Copy:
   - **Project URL**
   - **anon public key**

### Step 3: Configure App (1 min)
Open `js/supabase-config.js`:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 4: Create Database (1 min)
1. Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy SQL from `SUPABASE_SETUP.md` (Section 4)
4. Click "Run"

### Step 5: Test! (30 sec)
```bash
npm run dev
```
Then create an account and save a custom phrase!

---

## 📋 What You Get

✅ User authentication (email/password)
✅ Secure custom phrase storage
✅ Real-time sync across devices
✅ Private user data (RLS protected)
✅ Custom phrases only for logged-in users

---

## 🎯 How It Works

### Without Login:
- ❌ Can't save custom phrases
- ✅ Can use default phrase tiles
- ✅ Can use all other features

### With Login:
- ✅ Save custom phrases to database
- ✅ Phrases sync across devices
- ✅ Phrases persist forever
- ✅ Private to your account

---

## 🐛 Common Issues

**"Failed to load custom phrases"**
→ Check credentials in `js/supabase-config.js`

**"Sign in failed"**
→ Disable email confirmation in Supabase settings (for testing)

**Custom phrases not showing**
→ Make sure SQL schema was created correctly

---

## 📞 Need Help?

Full setup guide: `SUPABASE_SETUP.md`
