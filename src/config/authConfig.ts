import type { Configuration, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { env } from './env';

// Debug: Log environment values (remove in production)
console.log('Environment values loaded:');
console.log('AZURE_CLIENT_ID:', env.AZURE_CLIENT_ID);
console.log('AZURE_TENANT_ID:', env.AZURE_TENANT_ID);
console.log('AZURE_AUTHORITY:', env.AZURE_AUTHORITY);
console.log('REDIRECT_URI:', env.REDIRECT_URI);

// Validate that we're not using placeholder values
if (env.AZURE_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
  console.error('🚨 ERROR: AZURE_CLIENT_ID is still set to placeholder value "YOUR_CLIENT_ID_HERE"');
  console.error('Please update your .env file with your actual Azure AD app registration Client ID');
}



// Azure AD configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: env.AZURE_CLIENT_ID , // Replace with your client ID
    authority: env.AZURE_AUTHORITY || `https://login.microsoftonline.com/${env.AZURE_TENANT_ID }`, // Replace with your tenant ID
    redirectUri: env.REDIRECT_URI || 'http://localhost:5173', // Your redirect URI
    postLogoutRedirectUri: env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:5173', // Optional: redirect after logout
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error('MSAL Error:', message);
            break;
          case 1: // LogLevel.Warning
            console.warn('MSAL Warning:', message);
            break;
          case 2: // LogLevel.Info
            console.info('MSAL Info:', message);
            break;
          case 3: // LogLevel.Verbose
            console.debug('MSAL Debug:', message);
            break;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: RedirectRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account', // Forces account selection
};

// Add scopes here for access token to be used at Microsoft Graph API endpoints.
export const graphRequest: PopupRequest = {
  scopes: ['User.Read'],
};

// Add scopes for Azure OpenAI (if needed)
export const azureOpenAIRequest: PopupRequest = {
  scopes: ['https://cognitiveservices.azure.com/user_impersonation'],
};

// Scopes for custom API (if you have a backend API)
export const customApiRequest: PopupRequest = {
  scopes: [`api://${env.API_CLIENT_ID || 'YOUR_API_CLIENT_ID_HERE'}/access_as_user`],
};