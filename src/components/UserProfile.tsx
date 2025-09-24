import React from 'react';
import { useMsal } from '@azure/msal-react';

interface UserProfileProps {
  showDetails?: boolean;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ showDetails = false, className = '' }) => {
  const { accounts } = useMsal();
  const account = accounts[0];

  if (!account) {
    return null;
  }

  const displayName = account.name || account.username || 'User';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (!showDetails) {
    // Simple avatar display
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-primary">{initials}</span>
        </div>
        <span className="text-sm font-medium hidden md:block">{displayName}</span>
      </div>
    );
  }

  // Detailed profile display
  return (
    <div className={`p-4 border rounded-lg bg-card ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-lg font-medium text-primary">{initials}</span>
        </div>
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{account.username}</p>
        </div>
      </div>
      
      {account.tenantId && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Tenant ID: {account.tenantId}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;