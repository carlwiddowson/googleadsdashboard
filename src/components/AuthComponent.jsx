import { useState, useEffect } from 'react';
import { LogOut, Key, CheckCircle, AlertCircle, Users, Info, X, ExternalLink } from 'lucide-react';
import GoogleAuthService from '../services/googleAuthService';
import { isPopupBlocked, getPopupInstructions } from '../utils/popupHelpers';
import { validateOAuthConfig, logConfigStatus } from '../utils/configValidator';

const AuthComponent = ({ onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authService] = useState(new GoogleAuthService());
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const [showPopupHelp, setShowPopupHelp] = useState(false);
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  const [configValidation, setConfigValidation] = useState(null);

  useEffect(() => {
    // Validate configuration on load
    const validation = validateOAuthConfig();
    setConfigValidation(validation);
    logConfigStatus();
    
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      onAuthChange(authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      onAuthChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    setShowPopupHelp(false);
    setShowConfigHelp(false);
    
    // Check configuration first
    const validation = validateOAuthConfig();
    if (!validation.isValid) {
      setShowConfigHelp(true);
      setError('OAuth configuration issues detected. Please check your setup.');
      return;
    }
    
    // Check for popup blocker
    if (isPopupBlocked()) {
      setShowPopupHelp(true);
      setError('Popups are blocked. Please allow popups and try again.');
      return;
    }
    
    setAuthenticating(true);
    
    try {
      const accessToken = await authService.authenticateWithPopup();
      if (accessToken) {
        setIsAuthenticated(true);
        onAuthChange(true);
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.message.includes('OAuth client not found') || error.message.includes('invalid_client')) {
        errorMessage = 'OAuth client configuration error. Please check your Google Cloud Console setup.';
        setShowConfigHelp(true);
      } else if (error.message.includes('Popup blocked')) {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
        setShowPopupHelp(true);
      } else if (error.message.includes('cancelled')) {
        errorMessage = 'Authentication was cancelled.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Authentication timed out. Please try again.';
      }
      
      setError(errorMessage);
      
      // Clear error after 10 seconds
      setTimeout(() => setError(null), 10000);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setIsAuthenticated(false);
    onAuthChange(false);
    setError(null);
    setShowPopupHelp(false);
    setShowConfigHelp(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm">Checking authentication...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Configuration Help Modal */}
      {showConfigHelp && configValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold">OAuth Configuration Issues</h3>
              </div>
              <button
                onClick={() => setShowConfigHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm font-medium mb-2">Issues Found:</p>
                <ul className="text-red-700 text-sm space-y-1">
                  {configValidation.issues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm font-medium mb-2">Current Configuration:</p>
                <div className="text-blue-700 text-xs space-y-1">
                  <div>Client ID: {configValidation.config.clientId}</div>
                  <div>Redirect URI: {configValidation.config.redirectUri}</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm font-medium mb-2">Quick Fix:</p>
                <ol className="text-yellow-700 text-sm space-y-1">
                  <li>1. Check your <code className="bg-yellow-200 px-1 rounded">.env</code> file</li>
                  <li>2. Verify Google Cloud Console setup</li>
                  <li>3. Restart the development server</li>
                </ol>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfigHelp(false)}
                  className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowConfigHelp(false);
                    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center space-x-1"
                >
                  <span>Open Console</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Help Modal */}
      {showPopupHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Enable Popups</h3>
              </div>
              <button
                onClick={() => setShowPopupHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                To connect your Google Ads account, you need to allow popups for this site.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm font-medium mb-1">Instructions:</p>
                <p className="text-blue-700 text-sm">{getPopupInstructions()}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPopupHelp(false)}
                  className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPopupHelp(false);
                    handleSignIn();
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error display */}
      {error && !showPopupHelp && !showConfigHelp && (
        <div className="bg-red-50 border border-red-200 rounded px-3 py-1 text-sm text-red-700 max-w-xs">
          {error}
        </div>
      )}
      
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Connected</span>
          </div>
          <button
            onClick={handleSignOut}
            disabled={authenticating}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Not connected</span>
          </div>
          <button
            onClick={handleSignIn}
            disabled={authenticating}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Click to select your Google account and connect to Google Ads"
          >
            {authenticating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                <span>Select Account</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// OAuth callback handler component
export const AuthCallback = ({ onComplete }) => {
  const [status, setStatus] = useState('processing');
  const [authService] = useState(new GoogleAuthService());

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        console.error('OAuth error:', error);
        return;
      }

      if (code) {
        const accessToken = await authService.exchangeCodeForToken(code);
        if (accessToken) {
          setStatus('success');
          // Redirect to main dashboard after successful auth
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <Key className="h-12 w-12 mx-auto mb-4 text-blue-600" />
        
        {status === 'processing' && (
          <>
            <h2 className="text-xl font-semibold mb-2">Connecting to Google Ads</h2>
            <p className="text-gray-600 mb-4">Please wait while we establish the connection...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2 text-green-600">Connection Successful!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Connection Failed</h2>
            <p className="text-gray-600 mb-4">There was an error connecting to Google Ads.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
