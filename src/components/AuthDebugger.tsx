import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { chatService } from '../api/chatService';
import { Button } from './ui/button';

const AuthDebugger: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (instance) {
      chatService.setMsalInstance(instance);
    }
  }, [instance]);

  const handleDebugToken = async () => {
    setIsLoading(true);
    try {
      // Capture console logs
      const originalLog = console.log;
      const logs: string[] = [];
      
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
        ).join(' '));
        originalLog(...args);
      };

      await chatService.debugToken();
      
      console.log = originalLog;
      setDebugInfo(logs.join('\\n'));
    } catch (error) {
      setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApiCall = async () => {
    setIsLoading(true);
    try {
      const result = await chatService.sendMessage('Hello, this is a test message');
      setDebugInfo(`✅ API Call Successful:\\n${result}`);
    } catch (error) {
      setDebugInfo(`❌ API Call Failed:\\n${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    setIsLoading(true);
    try {
      const isHealthy = await chatService.healthCheck();
      setDebugInfo(`Backend Health Check: ${isHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    } catch (error) {
      setDebugInfo(`Backend Health Check Failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🔧 Authentication Debugger
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Current Configuration</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Use Custom API Scopes:</strong> {import.meta.env.VITE_USE_CUSTOM_API_SCOPES || 'false'}</p>
              <p><strong>Custom API Client ID:</strong> {import.meta.env.VITE_CUSTOM_API_CLIENT_ID || 'Not set'}</p>
              <p><strong>Chat API URL:</strong> {import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5280'}</p>
              <p><strong>Authenticated:</strong> {accounts.length > 0 ? '✅ Yes' : '❌ No'}</p>
              {accounts.length > 0 && (
                <p><strong>User:</strong> {accounts[0].name || accounts[0].username}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleDebugToken} disabled={isLoading || accounts.length === 0}>
              {isLoading ? 'Debugging...' : '🔍 Debug JWT Token'}
            </Button>
            
            <Button onClick={handleHealthCheck} disabled={isLoading} variant="outline">
              {isLoading ? 'Checking...' : '🏥 Backend Health Check'}
            </Button>
            
            <Button onClick={handleTestApiCall} disabled={isLoading || accounts.length === 0} variant="outline">
              {isLoading ? 'Testing...' : '🧪 Test API Call'}
            </Button>
          </div>

          {accounts.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                ⚠️ You need to sign in first to debug authentication tokens.
              </p>
            </div>
          )}
        </div>

        {debugInfo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Debug Output:</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono overflow-auto max-h-96">
                {debugInfo}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Quick Setup Guide</h3>
          <div className="text-sm text-green-700 space-y-2">
            <p><strong>Option 1 (Recommended): Custom API Tokens</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Create a backend API app registration in Azure AD</li>
              <li>Set VITE_CUSTOM_API_CLIENT_ID to your backend API's client ID</li>
              <li>Set VITE_USE_CUSTOM_API_SCOPES=true</li>
              <li>Configure your backend to validate tokens with audience: api://YOUR_API_CLIENT_ID</li>
            </ol>
            
            <p className="mt-3"><strong>Option 2 (Quick Fix): Microsoft Graph Tokens</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Keep VITE_USE_CUSTOM_API_SCOPES=false (current setting)</li>
              <li>Configure your backend to accept Microsoft Graph tokens</li>
              <li>Set audience to: 00000003-0000-0000-c000-000000000000</li>
            </ol>
            
            <p className="mt-3">📖 <strong>See AUTHENTICATION_SETUP_GUIDE.md for detailed instructions</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;