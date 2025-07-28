// Helper functions for popup authentication

export const isPopupBlocked = () => {
  try {
    const popup = window.open('', '_blank', 'width=1,height=1');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      return true;
    }
    popup.close();
    return false;
  } catch (e) {
    return true;
  }
};

export const showPopupBlockedMessage = () => {
  return `
    Popup blocked! To connect your Google Ads account:
    
    1. Click the popup blocker icon in your browser's address bar
    2. Select "Always allow popups from this site"
    3. Try connecting again
    
    Or try these steps:
    • Chrome: Click the popup icon in the address bar
    • Firefox: Click the shield icon and select "Disable Blocking"
    • Safari: Go to Preferences > Websites > Pop-up Windows
  `;
};

export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'Unknown';
};

export const getPopupInstructions = () => {
  const browser = detectBrowser();
  
  const instructions = {
    Chrome: 'Click the popup blocker icon in the address bar and select "Always allow"',
    Firefox: 'Click the shield icon and select "Disable Blocking for This Site"',
    Safari: 'Go to Safari > Preferences > Websites > Pop-up Windows and allow this site',
    Edge: 'Click the popup blocker icon in the address bar and select "Always allow"',
    Unknown: 'Please allow popups for this site in your browser settings'
  };
  
  return instructions[browser] || instructions.Unknown;
};
