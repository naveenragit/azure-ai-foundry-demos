import React from 'react';
import LoginButton from './LoginButton';

const AuthLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Azure AI Foundry Demos
            </h1>
            <p className="text-gray-600">
              Explore AI capabilities with Azure services
            </p>
          </div>
          
          <div className="mb-8">
            <svg 
              className="mx-auto h-24 w-24 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Sign in to continue
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Use your organizational account to access Azure AI services and demos
            </p>
          </div>

          <LoginButton className="w-full" />

          <div className="mt-6 text-xs text-gray-500">
            <p>
              By signing in, you agree to use this application in accordance with 
              your organization's policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLandingPage;