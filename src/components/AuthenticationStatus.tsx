import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import UserProfile from './UserProfile';

interface AuthenticationStatusProps {
  showUserProfile?: boolean;
  className?: string;
}

const AuthenticationStatus: React.FC<AuthenticationStatusProps> = ({ 
  showUserProfile = true, 
  className = '' 
}) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {isAuthenticated ? (
        <>
          {showUserProfile && <UserProfile />}
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
};

export default AuthenticationStatus;