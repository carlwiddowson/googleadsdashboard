# OAuth Configuration Guide

## Google Cloud Console Setup

Your Google Ads Dashboard is hosted at: **https://googleadsdashboard.vercel.app/**

### Required OAuth 2.0 Settings

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client ID**: `503894896564-7op7dfk6jraacgjdocl8gp2ndsp53at1.apps.googleusercontent.com`

3. **Add Authorized JavaScript Origins**:
   - `http://localhost:3001` (for development)
   - `https://googleadsdashboard.vercel.app` (for production)

4. **Add Authorized Redirect URIs**:
   - `http://localhost:3001/auth/callback` (for development)
   - `https://googleadsdashboard.vercel.app/auth/callback` (for production)

### Environment Variables

For **development** (.env):
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=503894896564-7op7dfk6jraacgjdocl8gp2ndsp53at1.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3001/auth/callback
```

For **production** (Vercel environment variables):
```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=503894896564-7op7dfk6jraacgjdocl8gp2ndsp53at1.apps.googleusercontent.com
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://googleadsdashboard.vercel.app/auth/callback
```

### Required APIs

Make sure these APIs are enabled in your Google Cloud project:
- Google Ads API
- Google OAuth2 API

### Testing

1. **Development**: Visit http://localhost:3001 and click "Select Account"
2. **Production**: Visit https://googleadsdashboard.vercel.app and click "Select Account"

The app will automatically validate your configuration and show helpful error messages if something is misconfigured.
