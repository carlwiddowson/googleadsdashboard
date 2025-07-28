// Configuration validator for Google Ads OAuth setup

export const validateOAuthConfig = () => {
  const config = {
    clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
    redirectUri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI,
    adsClientId: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
    developerToken: import.meta.env.VITE_GOOGLE_MCC_TOKEN,
    customerId: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
  };

  const issues = [];

  // Check OAuth Client ID
  if (!config.clientId) {
    issues.push('VITE_GOOGLE_OAUTH_CLIENT_ID is missing from environment variables');
  } else if (!config.clientId.includes('.apps.googleusercontent.com')) {
    issues.push('VITE_GOOGLE_OAUTH_CLIENT_ID should end with .apps.googleusercontent.com');
  }

  // Check Redirect URI
  if (!config.redirectUri) {
    issues.push('VITE_GOOGLE_OAUTH_REDIRECT_URI is missing from environment variables');
  } else {
    const validUrls = [
      'localhost:3001',
      'localhost:3000', 
      'googleadsdashboard.vercel.app'
    ];
    const isValidUrl = validUrls.some(url => config.redirectUri.includes(url));
    if (!isValidUrl) {
      issues.push('VITE_GOOGLE_OAUTH_REDIRECT_URI should point to localhost:3001 (dev) or googleadsdashboard.vercel.app (prod)');
    }
  }

  // Check Google Ads configuration
  if (!config.adsClientId) {
    issues.push('VITE_GOOGLE_ADS_CLIENT_ID is missing');
  }

  if (!config.developerToken) {
    issues.push('VITE_GOOGLE_MCC_TOKEN (developer token) is missing');
  }

  return {
    isValid: issues.length === 0,
    issues,
    config: {
      clientId: config.clientId ? `${config.clientId.substring(0, 20)}...` : 'NOT SET',
      redirectUri: config.redirectUri || 'NOT SET',
      adsClientId: config.adsClientId || 'NOT SET',
      developerToken: config.developerToken ? `${config.developerToken.substring(0, 10)}...` : 'NOT SET',
    }
  };
};

export const logConfigStatus = () => {
  const validation = validateOAuthConfig();
  
  console.group('🔧 Google Ads OAuth Configuration');
  console.log('Client ID:', validation.config.clientId);
  console.log('Redirect URI:', validation.config.redirectUri);
  console.log('Ads Client ID:', validation.config.adsClientId);
  console.log('Developer Token:', validation.config.developerToken);
  
  if (validation.issues.length > 0) {
    console.group('⚠️ Configuration Issues:');
    validation.issues.forEach(issue => console.warn(`• ${issue}`));
    console.groupEnd();
  } else {
    console.log('✅ Configuration looks good!');
  }
  
  console.groupEnd();
  
  return validation;
};
