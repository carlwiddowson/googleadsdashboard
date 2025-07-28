class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback';
    this.scope = 'https://www.googleapis.com/auth/adwords';
  }

  // Generate OAuth URL for Google Ads authentication
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_ADS_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        // Store tokens in localStorage
        localStorage.setItem('google_ads_access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('google_ads_refresh_token', data.refresh_token);
        }
        localStorage.setItem('google_ads_token_expiry', Date.now() + (data.expires_in * 1000));
        return data.access_token;
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('google_ads_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: import.meta.env.VITE_GOOGLE_ADS_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('google_ads_access_token', data.access_token);
        localStorage.setItem('google_ads_token_expiry', Date.now() + (data.expires_in * 1000));
        return data.access_token;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Get current access token (refresh if needed)
  async getAccessToken() {
    const accessToken = localStorage.getItem('google_ads_access_token');
    const tokenExpiry = localStorage.getItem('google_ads_token_expiry');

    if (!accessToken) {
      return null;
    }

    // Check if token is expired
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        // If refresh fails, clear stored tokens
        this.clearTokens();
        return null;
      }
    }

    return accessToken;
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getAccessToken();
    return !!token;
  }

  // Clear stored tokens
  clearTokens() {
    localStorage.removeItem('google_ads_access_token');
    localStorage.removeItem('google_ads_refresh_token');
    localStorage.removeItem('google_ads_token_expiry');
  }

  // Sign out
  signOut() {
    this.clearTokens();
  }
}

export default GoogleAuthService;
