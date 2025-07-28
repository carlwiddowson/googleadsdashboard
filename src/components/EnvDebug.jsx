// Debug component to test environment variable loading
import { validateOAuthConfig } from '../utils/configValidator';

const EnvDebug = () => {
  const validation = validateOAuthConfig();
  
  console.log('Environment Variables Test:');
  console.log('CLIENT_ID:', import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID);
  console.log('REDIRECT_URI:', import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI);
  console.log('ADS_CLIENT_ID:', import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID);
  console.log('MCC_TOKEN:', import.meta.env.VITE_GOOGLE_MCC_TOKEN);
  console.log('Validation:', validation);

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Environment Variables Debug</h3>
      <div className="space-y-1 text-sm">
        <div>CLIENT_ID: {import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || 'NOT SET'}</div>
        <div>REDIRECT_URI: {import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || 'NOT SET'}</div>
        <div>ADS_CLIENT_ID: {import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || 'NOT SET'}</div>
        <div>MCC_TOKEN: {import.meta.env.VITE_GOOGLE_MCC_TOKEN || 'NOT SET'}</div>
        <div>Valid: {validation.isValid ? 'YES' : 'NO'}</div>
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
      </div>
    </div>
  );
};

export default EnvDebug;
