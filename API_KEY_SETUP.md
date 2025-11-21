# 🔑 Google Gemini API Key Setup Guide

## Problem: API Quota Exceeded

If you're seeing "quota exceeded" or "429" errors, your API key has hit its free tier limit.

## Solution: Get a Fresh API Key

### Step 1: Visit Google AI Studio

Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign In

- Use your Google account
- Accept terms of service if prompted

### Step 3: Create API Key

1. Click **"Create API Key"** button
2. Select **"Create API key in new project"** (recommended)
3. Wait a few seconds for generation
4. Click **"Copy"** to copy your new key

### Step 4: Update Your `.env` File

1. Open your project folder
2. Find the `.env` file (create it if it doesn't exist)
3. Add your new API key:

```env
VITE_GEMINI_API_KEY=your_new_api_key_here
```

Replace `your_new_api_key_here` with the actual key you copied.

### Step 5: Restart the Development Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 6: Test the App

Open http://localhost:3000 and try sending a message!

---

## Understanding API Limits

### Free Tier Limits (as of 2024):
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**

### If You Hit Limits:
1. Wait a few minutes for the rate limit to reset
2. Use shorter messages to conserve tokens
3. Consider upgrading to a paid plan

### Upgrade to Paid Plan:
- Go to: https://console.cloud.google.com/
- Enable billing on your project
- Much higher limits (60 requests/min, no daily cap)

---

## Troubleshooting

### "API key not configured" Error
- Make sure `.env` file exists in project root
- Check that the variable name is exactly: `VITE_GEMINI_API_KEY`
- Restart dev server after adding key

### "Network connection issue" Error
- Check your internet connection
- Verify firewall isn't blocking Google APIs
- Try a different network (mobile hotspot, etc.)

### "Invalid API key" Error
- Key might be malformed (check for spaces)
- Key might be revoked - create a new one
- Make sure you copied the entire key

### Still Not Working?
1. Delete `.env` file
2. Copy `.env.example` to `.env`
3. Add your API key
4. Clear browser cache
5. Restart server

---

## Security Reminders

✅ **DO:**
- Keep your API key in `.env` file
- Add `.env` to `.gitignore` (already done)
- Never commit API keys to GitHub

❌ **DON'T:**
- Share your API key publicly
- Commit `.env` to version control
- Hardcode API keys in source files

---

## Quick Reference

| What | Where |
|------|-------|
| Get API Key | https://aistudio.google.com/app/apikey |
| Check Usage | https://aistudio.google.com/app/apikey (quota section) |
| API Documentation | https://ai.google.dev/gemini-api/docs |
| Billing Console | https://console.cloud.google.com/ |

---

## Need Help?

- **Google AI Documentation**: https://ai.google.dev/gemini-api/docs
- **Rate Limits Info**: https://ai.google.dev/gemini-api/docs/rate-limits
- **Community**: https://developers.googleblog.com/

---

**Last Updated**: January 2025