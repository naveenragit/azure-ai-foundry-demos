import React from 'react';
import { useMsal } from '@azure/msal-react';

const LogoutButton: React.FC = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/'
    }).catch(e => {
      console.error('Logout failed:', e);
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;