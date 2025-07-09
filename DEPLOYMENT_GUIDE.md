# 🚀 Secure Backend Deployment Guide

This guide will help you deploy the secure server-side functions to Supabase, moving validation from frontend to backend.

## 🎯 **What We're Building**

- **Secure Edge Functions**: Server-side validation for all game actions
- **Anti-cheat protection**: No more client-side manipulation
- **Rate limiting**: Prevent action spam
- **Audit logging**: Track all user actions

## 📋 **Prerequisites**

1. **Supabase CLI** installed
2. **Supabase project** set up
3. **Service role key** from your Supabase dashboard

## 🔧 **Step 1: Install Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

## 🔧 **Step 2: Initialize Supabase in Your Project**

```bash
# Initialize Supabase (creates supabase/ directory)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

## 🔧 **Step 3: Set Environment Variables**

In your Supabase dashboard:
1. Go to **Settings → API**
2. Copy your **Project URL** and **service_role key**
3. Go to **Settings → Edge Functions**
4. Add these environment variables:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

## 🔧 **Step 4: Deploy Edge Functions**

```bash
# Deploy the perform-action function
supabase functions deploy perform-action

# Deploy the rename-monster function
supabase functions deploy rename-monster
```

## 🔧 **Step 5: Test the Functions**

```bash
# Test perform-action function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/perform-action' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"actionType": "feed"}'

# Test rename-monster function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/rename-monster' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"newName": "Fluffy"}'
```

## 🔧 **Step 6: Update Frontend**

The frontend code has already been updated to use the secure functions. Just restart your dev server:

```bash
npm start
```

## 🛡️ **Security Improvements**

### **Before (Insecure)**
- ❌ Client-side validation only
- ❌ Game logic in browser
- ❌ Easy to manipulate stats
- ❌ No rate limiting

### **After (Secure)**
- ✅ Server-side validation
- ✅ Game logic on server
- ✅ Anti-cheat protection
- ✅ Rate limiting built-in
- ✅ Audit logging
- ✅ Input sanitization

## 🧪 **Testing Security**

### **Try to Hack (Should Fail)**
```javascript
// This should no longer work
const store = useGameStore.getState();
store.setMonster({
  ...store.monster,
  stats: { strength: 100, intelligence: 100, /* ... */ }
});
```

### **Legitimate Actions (Should Work)**
- Feed monster (3 times per day)
- Train monster (3 times per day)
- Rest monster (3 times per day)
- Rename monster (anytime)

## 🔍 **Monitoring**

Check your Supabase dashboard:
- **Edge Functions → Logs**: See function execution logs
- **Database → Logs**: See database queries
- **Authentication → Users**: Monitor user activity

## 🚨 **Troubleshooting**

### **Function Not Found**
```bash
# Redeploy functions
supabase functions deploy perform-action
supabase functions deploy rename-monster
```

### **Authentication Errors**
- Check your service role key
- Verify environment variables
- Ensure user is authenticated

### **CORS Errors**
- Functions include CORS headers
- Check browser console for details

## 🎉 **You're Now Secure!**

Your Hashlings game now has:
- **Server-side validation** for all actions
- **Anti-cheat protection** against manipulation
- **Rate limiting** to prevent spam
- **Audit logging** for monitoring
- **Input sanitization** for safety

The game is now much harder to hack and suitable for a competitive environment! 🐾✨

## 🔄 **Next Steps**

Consider adding:
- **Real-time updates** with Supabase subscriptions
- **Advanced rate limiting** per user
- **Suspicious activity detection**
- **Backup and recovery** systems 