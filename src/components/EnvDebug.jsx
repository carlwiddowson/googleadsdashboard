// Debug component to test environment variable loading
import { validateOAuthConfig } from '../utils/configValidator';

const EnvDebug = () => {
  const validation = validateOAuthConfig();
  
  // Only log in development mode and avoid logging sensitive data
  if (import.meta.env.DEV) {
    console.log('Environment Variables Test:');
    console.log('CLIENT_ID:', import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('REDIRECT_URI:', import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI ? 'SET' : 'NOT SET');
    console.log('DEV_MODE:', import.meta.env.VITE_DEV_MODE ? 'SET' : 'NOT SET');
    console.log('Validation:', validation);
  }

  // Don't render debug info in production
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Environment Variables Debug (Development Only)</h3>
      <div className="space-y-1 text-sm">
        <div>CLIENT_ID: {import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ? 'SET ✓' : 'NOT SET ✗'}</div>
        <div>REDIRECT_URI: {import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI ? 'SET ✓' : 'NOT SET ✗'}</div>
        <div>DEV_MODE: {import.meta.env.VITE_DEV_MODE ? 'SET ✓' : 'NOT SET ✗'}</div>
        <div>Valid: {validation.isValid ? 'YES ✓' : 'NO ✗'}</div>
        {validation.issues.length > 0 && (
          <div>
            <strong>Issues:</strong>
            <ul className="ml-4">
              {validation.issues.map((issue, i) => (
                <li key={i}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
        {validation.securityIssues && validation.securityIssues.length > 0 && (
          <div className="mt-2">
            <strong className="text-red-600">Security Issues:</strong>
            <ul className="ml-4 text-red-600">
              {validation.securityIssues.map((issue, i) => (
                <li key={i}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-xs">
        <strong>⚠️ Security Notice:</strong> This debug component only shows in development mode and does not expose actual credential values.
      </div>
    </div>
  );
};

export default EnvDebug;
