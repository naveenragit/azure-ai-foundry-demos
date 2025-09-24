import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './config/authConfig'
import './index.css'
import App from './App.tsx'


console.log('Initializing MSAL with config:', msalConfig);

const msalInstance = new PublicClientApplication(msalConfig)

// Wait for MSAL to initialize
msalInstance.initialize().then(() => {
  console.log('MSAL instance initialized successfully');
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
    </StrictMode>,
  )
}).catch((error) => {
  console.error('Failed to initialize MSAL:', error);
  
  // Fallback rendering without MSAL if initialization fails
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">Failed to initialize authentication system.</p>
          <pre className="text-sm text-left bg-gray-100 p-4 rounded">
            {error.toString()}
          </pre>
        </div>
      </div>
    </StrictMode>,
  )
});
