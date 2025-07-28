# Google Cloud Console Setup for Frontend OAuth

## 🚨 CRITICAL: Your OAuth Application Type

The error you're seeing (`client_secret is missing`) happens because your Google Cloud Console OAuth application is configured incorrectly for frontend use.

## Step-by-Step Fix

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project

### 2. Navigate to Credentials
- Go to: **APIs & Services** → **Credentials**
- Find your OAuth 2.0 Client ID

### 3. Check Application Type
Click on your OAuth client and verify:

#### ❌ WRONG (Causes client_secret error):
```
Application type: Web application
```

#### ✅ CORRECT (For frontend apps):
```
Application type: Web application
```

**BUT** make sure you configure it properly for public clients:

### 4. Authorized Redirect URIs
Add these exact URLs:
```
http://localhost:3000/auth/callback
http://localhost:5173/auth/callback  
https://yourdomain.vercel.app/auth/callback
```

### 5. Set Up for Public Client
In the OAuth client settings:
- **DO NOT** download or use the client secret in your frontend
- Only use the **Client ID** in your frontend code
- The client secret should only be used in backend applications

## Environment Variables Setup

### In your `.env.local` file:
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_DEV_MODE=true
```

### In Vercel Environment Variables:
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://yourapp.vercel.app/auth/callback
```

## 🔒 Security Note

- ✅ **Client ID**: Safe to expose in frontend
- ❌ **Client Secret**: NEVER put in frontend (not needed for public clients)
- ✅ **This setup**: Follows Google's recommended security practices for SPAs

## Testing
1. Update your `.env.local` with your real Client ID
2. Restart your dev server: `npm run dev`
3. Try the OAuth flow again

The `client_secret is missing` error should disappear once you configure this correctly.
