// Configuration validator for Google Ads OAuth setup

export const validateOAuthConfig = () => {
  const config = {
    clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
    redirectUri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI,
    devMode: import.meta.env.VITE_DEV_MODE,
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
      'localhost:5173', // Vite default port
      'localhost:3001',
      'localhost:3000', 
      'googleadsdashboard.vercel.app'
    ];
    const isValidUrl = validUrls.some(url => config.redirectUri.includes(url));
    if (!isValidUrl) {
      issues.push('VITE_GOOGLE_OAUTH_REDIRECT_URI should point to localhost:5173 (dev) or your production domain');
    }
  }

  // Security warnings
  const securityIssues = [];
  
  // Check if old insecure variables are still present
  if (import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID) {
    securityIssues.push('VITE_GOOGLE_ADS_CLIENT_ID should not be in frontend environment variables');
  }
  if (import.meta.env.VITE_GOOGLE_MCC_TOKEN) {
    securityIssues.push('VITE_GOOGLE_MCC_TOKEN should not be in frontend environment variables');
  }

  return {
    isValid: issues.length === 0,
    issues,
    securityIssues,
    config: {
      clientId: config.clientId ? `${config.clientId.substring(0, 20)}...` : 'NOT SET',
      redirectUri: config.redirectUri || 'NOT SET',
      devMode: config.devMode || 'NOT SET',
    }
  };
};

export const logConfigStatus = () => {
  const validation = validateOAuthConfig();
  
  console.group('🔧 Google Ads OAuth Configuration');
  console.log('Client ID:', validation.config.clientId);
  console.log('Redirect URI:', validation.config.redirectUri);
  console.log('Dev Mode:', validation.config.devMode);
  
  if (validation.securityIssues && validation.securityIssues.length > 0) {
    console.group('🚨 Security Issues:');
    validation.securityIssues.forEach(issue => console.error(`• ${issue}`));
    console.groupEnd();
  }
  
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
