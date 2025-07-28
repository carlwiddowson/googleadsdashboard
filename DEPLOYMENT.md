# Vercel Deployment Setup

## Environment Variables Configuration

### Step 1: Set up Vercel Environment Variables

You need to add these environment variables in your Vercel dashboard:

#### Frontend Variables (Safe for client-side)
These variables will be available in your React app:

```bash
# In Vercel Dashboard -> Settings -> Environment Variables
VITE_GOOGLE_ADS_CLIENT_ID=your_actual_client_id
VITE_GOOGLE_MCC_TOKEN=your_actual_mcc_token  
VITE_GOOGLE_OAUTH_CLIENT_ID=your_actual_oauth_client_id
VITE_GOOGLE_OAUTH_REDIRECT_URI=https://your-app.vercel.app/auth/callback
```

#### Backend Variables (Server-only)
These variables will only be available in API routes and server functions:

```bash
# In Vercel Dashboard -> Settings -> Environment Variables
GOOGLE_ADS_CLIENT_SECRET=your_actual_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_actual_developer_token
GOOGLE_ADS_CUSTOMER_ID=your_actual_customer_id
```

### Step 2: Using Variables in Your Code

#### Frontend (React Components)
```javascript
// Access frontend variables with import.meta.env
const clientId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
const mccToken = import.meta.env.VITE_GOOGLE_MCC_TOKEN;
const oauthClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
```

#### Backend (API Routes)
```javascript
// In /api routes, access server variables with process.env
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
```

### Step 3: Deploy

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## Security Notes

- ✅ **VITE_** prefixed variables are safe for frontend (public)
- ❌ **Never** put sensitive credentials in VITE_ variables
- ✅ Server-only variables (secrets, tokens) should NOT have VITE_ prefix
- ✅ Always use different redirect URIs for development vs production

## Local Development

1. Copy your actual values to `.env.local`
2. Never commit `.env.local` to git
3. Use the same variable names as in Vercel for consistency
