import { useState, useEffect } from 'react';
import { LogIn, LogOut, Key, CheckCircle, AlertCircle } from 'lucide-react';
import GoogleAuthService from '../services/googleAuthService';

const AuthComponent = ({ onAuthChange }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authService] = useState(new GoogleAuthService());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
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

  const handleSignIn = () => {
    const authUrl = authService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleSignOut = () => {
    authService.signOut();
    setIsAuthenticated(false);
    onAuthChange(false);
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
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Connected</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
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
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Connect Google Ads</span>
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
