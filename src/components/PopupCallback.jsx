import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Key } from 'lucide-react';

const PopupCallback = () => {
  useEffect(() => {
    // This component runs in the popup window
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code || error) {
      // Close the popup - the parent window polling will detect this
      window.close();
    }
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <Key className="h-8 w-8 mx-auto mb-4 text-blue-600" />
        
        {error ? (
          <>
            <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-600" />
            <h2 className="text-lg font-semibold mb-2 text-red-600">Authentication Failed</h2>
            <p className="text-gray-600 text-sm mb-4">Error: {error}</p>
            <p className="text-gray-500 text-xs">This window will close automatically...</p>
          </>
        ) : code ? (
          <>
            <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-600" />
            <h2 className="text-lg font-semibold mb-2 text-green-600">Success!</h2>
            <p className="text-gray-600 text-sm mb-4">Authentication completed successfully.</p>
            <p className="text-gray-500 text-xs">This window will close automatically...</p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Processing Authentication</h2>
            <p className="text-gray-600 text-sm mb-4">Please wait...</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupCallback;
