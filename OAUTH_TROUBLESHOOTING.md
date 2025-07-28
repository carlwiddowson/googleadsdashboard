# Google OAuth Setup Troubleshooting Guide

## Error: "OAuth client was not found" (Error 401: invalid_client)

This error occurs when the Google OAuth client is not properly configured. Here's how to fix it:

## 🔧 **Step 1: Google Cloud Console Setup**

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com
- Select your project or create a new one

### 2. Enable Required APIs
- Go to **APIs & Services** > **Library**
- Enable these APIs:
  - **Google Ads API**
  - **Google OAuth2 API** (usually enabled by default)

### 3. Configure OAuth Consent Screen
- Go to **APIs & Services** > **OAuth consent screen**
- Choose **External** (unless you have a Google Workspace account)
- Fill in required information:
  - **App name**: Google Ads Dashboard
  - **User support email**: Your email
  - **Developer contact**: Your email
- Add scopes: `https://www.googleapis.com/auth/adwords`
- Save and continue

### 4. Create OAuth 2.0 Credentials
- Go to **APIs & Services** > **Credentials**
- Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
- Choose **Web application**
- Set up:
  - **Name**: Google Ads Dashboard
  - **Authorized JavaScript origins**: 
    - `http://localhost:3000`
  - **Authorized redirect URIs**:
    - `http://localhost:3000/auth/callback`

## 🔧 **Step 2: Update Environment Variables**

Update your `.env` file with the correct values:

```env
# OAuth Configuration (CRITICAL - must match Google Cloud Console)
VITE_GOOGLE_OAUTH_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback

# Google Ads API Configuration
VITE_GOOGLE_ADS_CLIENT_ID=6721897224
VITE_GOOGLE_MCC_TOKEN=FCabA0LrjOnj7QAMx9w_TQ
GOOGLE_ADS_DEVELOPER_TOKEN=FCabA0LrjOnj7QAMx9w_TQ
GOOGLE_ADS_CUSTOMER_ID=6721897224

# Backend configuration (if using server-side flow)
GOOGLE_ADS_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
```

## 🔧 **Step 3: Verify Current Configuration**

Your current OAuth client ID is:
```
503894896564-7op7dfk6jraacgjdocl8gp2ndsp53at1.apps.googleusercontent.com
```

**Verify this in Google Cloud Console:**
1. Go to **APIs & Services** > **Credentials**
2. Find your OAuth 2.0 Client ID
3. Check that the Client ID matches exactly
4. Verify redirect URI is set to: `http://localhost:3000/auth/callback`

## 🚨 **Common Issues & Solutions:**

### Issue 1: Client ID Mismatch
- **Problem**: The client ID in `.env` doesn't match Google Cloud Console
- **Solution**: Copy the exact client ID from Google Cloud Console

### Issue 2: Wrong Application Type
- **Problem**: Created "Desktop application" instead of "Web application"
- **Solution**: Delete and recreate as "Web application"

### Issue 3: Missing Redirect URI
- **Problem**: `http://localhost:3000/auth/callback` not in authorized URIs
- **Solution**: Add it to "Authorized redirect URIs"

### Issue 4: OAuth Consent Screen Not Published
- **Problem**: App is in "Testing" mode with limited users
- **Solution**: Either:
  - Add your email to test users, OR
  - Publish the app (requires verification for sensitive scopes)

### Issue 5: Project Mismatch
- **Problem**: Using OAuth client from different Google Cloud project
- **Solution**: Ensure all APIs and credentials are in the same project

## 🔧 **Step 4: Test Configuration**

### Manual Test:
Visit this URL in your browser (replace CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=503894896564-7op7dfk6jraacgjdocl8gp2ndsp53at1.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/callback&scope=https://www.googleapis.com/auth/adwords&response_type=code&access_type=offline&prompt=select_account%20consent&include_granted_scopes=true
```

If you get "OAuth client was not found", the client ID is wrong or the project setup is incorrect.

## 🔧 **Step 5: Alternative Solutions**

### Option A: Create New OAuth Client
1. Delete current OAuth client in Google Cloud Console
2. Create new one with correct settings
3. Update `.env` with new client ID

### Option B: Use Different Google Account
- The OAuth client might be in a different Google account/project
- Check if you have multiple Google accounts
- Switch to the correct account in Google Cloud Console

## 🔧 **Step 6: Restart Development Server**

After making changes:
```bash
# Stop current server
pkill -f "vite"

# Restart with new environment variables
npm run dev
```

## ⚠️ **Security Note**

For production deployment, you'll need to:
1. Add your production domain to authorized origins
2. Update redirect URIs for production
3. Consider using a backend proxy to hide client secrets

---

If you're still having issues, please check:
1. That you're using the correct Google account
2. That the project has billing enabled (required for some APIs)
3. That you have the necessary permissions in the Google Cloud project
