import { PublicClientApplication } from '@azure/msal-browser';
import type { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { msalConfig, graphRequest, azureOpenAIRequest } from './authConfig';

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Helper function to get the current user account
export const getCurrentAccount = (): AccountInfo | null => {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
};

// Helper function to acquire access token silently
export const acquireAccessTokenSilently = async (scopes: string[]): Promise<string> => {
  const account = getCurrentAccount();
  if (!account) {
    throw new Error('No active account found');
  }

  try {
    const response: AuthenticationResult = await msalInstance.acquireTokenSilent({
      scopes,
      account,
    });
    return response.accessToken;
  } catch (error) {
    console.error('Silent token acquisition failed:', error);
    // If silent acquisition fails, you could fall back to interactive acquisition
    const response: AuthenticationResult = await msalInstance.acquireTokenPopup({
      scopes,
      account,
    });
    return response.accessToken;
  }
};

// Helper function to get Microsoft Graph token
export const getGraphToken = async (): Promise<string> => {
  return await acquireAccessTokenSilently(graphRequest.scopes);
};

// Helper function to get Azure OpenAI token
export const getAzureOpenAIToken = async (): Promise<string> => {
  return await acquireAccessTokenSilently(azureOpenAIRequest.scopes);
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return msalInstance.getAllAccounts().length > 0;
};

// Helper function to sign out
export const signOut = async (): Promise<void> => {
  const account = getCurrentAccount();
  if (account) {
    await msalInstance.logoutPopup({
      account,
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
  }
};

// Helper function to get user info
export const getUserInfo = (): { name?: string; username?: string; tenantId?: string } | null => {
  const account = getCurrentAccount();
  if (!account) return null;
  
  return {
    name: account.name,
    username: account.username,
    tenantId: account.tenantId,
  };
};