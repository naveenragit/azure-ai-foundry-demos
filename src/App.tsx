import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import Chat from '@/components/chat';
import AuthLandingPage from '@/components/AuthLandingPage';
import AuthDebugger from '@/components/AuthDebugger';
import { AzureOpenAIExample } from '@/components/AzureOpenAIExample';
import './App.css';

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  console.log('App rendering - isAuthenticated:', isAuthenticated);
  console.log('MSAL instance:', instance);
  console.log('Accounts:', instance.getAllAccounts());

  // Show a loading state while MSAL is initializing
  if (!instance) {
    console.log('MSAL instance not ready');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    console.log('User not authenticated, showing AuthLandingPage');
    return <AuthLandingPage />;
  }

  console.log('User authenticated, showing main app');
  // Show main app for authenticated users
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/azure-openai" element={<AzureOpenAIExample />} />
            <Route path="/debug" element={<AuthDebugger />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
