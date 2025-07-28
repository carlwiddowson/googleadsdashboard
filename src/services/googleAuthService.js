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
      prompt: 'select_account consent', // This forces account selection
      include_granted_scopes: 'true'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Open authentication popup
  openAuthPopup() {
    return new Promise((resolve, reject) => {
      const authUrl = this.getAuthUrl();
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      );

      // Check if popup was blocked
      if (!popup) {
        reject(new Error('Popup blocked. Please allow popups for this site.'));
        return;
      }

      // Poll for popup closure or message
      const pollTimer = setInterval(() => {
        try {
          // Check if popup is closed
          if (popup.closed) {
            clearInterval(pollTimer);
            reject(new Error('Authentication cancelled by user'));
            return;
          }

          // Try to access popup URL (will throw error due to CORS until redirect)
          const popupUrl = popup.location.href;
          
          // Check if we're on the callback URL
          if (popupUrl.includes('/auth/callback') || popupUrl.includes('code=')) {
            const urlParams = new URLSearchParams(popup.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            clearInterval(pollTimer);
            popup.close();

            if (error) {
              reject(new Error(`Authentication error: ${error}`));
            } else if (code) {
              resolve(code);
            } else {
              reject(new Error('No authorization code received'));
            }
          }
        } catch {
          // Expected error due to CORS, continue polling
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollTimer);
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error('Authentication timeout'));
      }, 300000);
    });
  }

  // Complete authentication flow with popup
  async authenticateWithPopup() {
    try {
      // Validate client configuration first
      if (!this.clientId) {
        throw new Error('OAuth client ID is not configured. Please check your environment variables.');
      }
      
      const code = await this.openAuthPopup();
      const accessToken = await this.exchangeCodeForToken(code);
      return accessToken;
    } catch (error) {
      console.error('Popup authentication failed:', error);
      
      // Enhance error messages
      if (error.message.includes('invalid_client')) {
        throw new Error('OAuth client not found. Please verify your Google Cloud Console configuration.');
      }
      
      throw error;
    }
  }

  // Exchange authorization code for access token (Public Client Flow)
  async exchangeCodeForToken(code) {
    try {
      // For public clients (frontend apps), we use PKCE instead of client_secret
      const requestBody = new URLSearchParams({
        client_id: this.clientId,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        // For public clients, we don't include client_secret
      });

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Token exchange failed:', data);
        
        // Provide helpful error messages
        if (data.error === 'invalid_client') {
          throw new Error(`OAuth configuration error: Your Google Cloud Console application must be configured as a "Public" client for frontend use. Current error: ${data.error_description || data.error}`);
        }
        
        if (data.error === 'redirect_uri_mismatch') {
          throw new Error(`Redirect URI mismatch. Make sure "${this.redirectUri}" is added to your authorized redirect URIs in Google Cloud Console.`);
        }
        
        throw new Error(`Token exchange failed: ${data.error_description || data.error}. For frontend apps, ensure your OAuth client is configured as a "Public" application type in Google Cloud Console.`);
      }
      
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
      } catch {
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
