import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '@/config/authConfig';

interface LoginButtonProps {
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ className = '' }) => {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await instance.loginPopup(loginRequest);
      // Login successful - error state will be cleared automatically
    } catch (e: any) {
      console.error('Login failed:', e);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (e.errorCode) {
        switch (e.errorCode) {
          case 'popup_window_error':
          case 'user_cancelled':
            errorMessage = 'Login was cancelled. Please try again.';
            break;
          case 'access_denied':
            errorMessage = 'Access denied. Please check your permissions.';
            break;
          case 'invalid_client':
            errorMessage = 'Configuration error. Please contact support.';
            break;
          case 'network_error':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Login failed: ${e.errorMessage || e.message || 'Unknown error'}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md max-w-sm">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
};

export default LoginButton;