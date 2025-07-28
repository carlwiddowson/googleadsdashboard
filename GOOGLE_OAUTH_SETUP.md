# Google OAuth Setup Guide

## Current Issue: Authentication Failure

**Error**: `Token exchange failed: client_secret is missing`

**Root Cause**: Your OAuth client is configured as a "Confidential Client" but you're using it from the frontend without a client secret.

## Solution: Configure as Public Client

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**

### Step 2: Find Your OAuth Client

1. Look for your OAuth 2.0 Client ID in the list
2. Click on it to edit

### Step 3: Change Application Type

**Current Configuration (causing the error)**:
- Application type: **Web application**
- Client secret: **Present**

**New Configuration (will fix the error)**:
- Application type: **Web application** (keep this)
- But configure it as a **Public Client**

### Step 4: Configure Authorized Redirect URIs

Add these redirect URIs:

**For Development:**
```
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback
```

**For Production:**
```
https://your-app-name.vercel.app/auth/callback
```

### Step 5: Remove Client Secret Dependency

The code has been updated to work without client_secret. Your OAuth client will work as a "public client" which is appropriate for frontend applications.

## Alternative Solution: Move OAuth to Backend

If you prefer to keep using a confidential client:

1. Create API routes in your `/api` folder
2. Handle OAuth flow server-side
3. Store client_secret safely on the server
4. Frontend calls your API instead of Google directly

## What Changed in the Code

1. ✅ Removed `VITE_` prefix from environment variables
2. ✅ Removed `client_secret` from token exchange requests
3. ✅ Updated error handling to guide configuration
4. ✅ Made refresh token work without client_secret

## Testing the Fix

1. Update your `.env.local` with correct values:
   ```
   GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
   GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

2. Make sure your Google Cloud Console OAuth client allows the redirect URI

3. Try authentication again

## Security Notes

✅ **Public clients are secure for frontend apps** - they don't need client secrets
✅ **Access tokens are still protected** - they expire and can be refreshed
✅ **This is Google's recommended approach** for browser-based applications

❌ **Never put client secrets in frontend code** - they would be visible to users
