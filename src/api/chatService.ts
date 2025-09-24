import type { IPublicClientApplication } from "@azure/msal-browser";
import { graphRequest } from '../config/authConfig';

// API configuration
const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5280';
const CHAT_ENDPOINT = '/OpenAIChat/chat';

// Token configuration - choose the appropriate strategy
// Option 1: Use custom API scopes (recommended)
const USE_CUSTOM_API_SCOPES = import.meta.env.VITE_USE_CUSTOM_API_SCOPES === 'true';
const CUSTOM_API_CLIENT_ID = import.meta.env.VITE_CUSTOM_API_CLIENT_ID;

// Validate configuration and determine effective strategy
const getEffectiveTokenStrategy = () => {
  if (USE_CUSTOM_API_SCOPES && !CUSTOM_API_CLIENT_ID) {
    console.warn('⚠️ USE_CUSTOM_API_SCOPES is true but VITE_CUSTOM_API_CLIENT_ID is not set. Falling back to Graph API tokens.');
    return false;
  }
  return USE_CUSTOM_API_SCOPES;
};

// Dynamic chat API request configuration
const getChatApiRequest = () => ({
  scopes: CUSTOM_API_CLIENT_ID ? [`api://${CUSTOM_API_CLIENT_ID}/access_as_user`] : ['api://YOUR_API_CLIENT_ID/access_as_user']
});

// Request/Response interfaces
interface ChatRequest {
  userMessage: string;
}

interface ChatResponse {
  response: string;
}

class ChatService {
  private msalInstance: IPublicClientApplication | null = null;

  public setMsalInstance(instance: IPublicClientApplication): void {
    this.msalInstance = instance;
  }

  private async getAccessToken(): Promise<string> {
    if (!this.msalInstance) {
      throw new Error("MSAL instance not set. Please call setMsalInstance() first.");
    }

    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error("No authenticated user found. Please sign in first.");
    }

    // Determine the effective token strategy
    const useCustomScopes = getEffectiveTokenStrategy();
    
    // Choose the appropriate token request based on configuration
    const tokenRequest = useCustomScopes ? getChatApiRequest() : graphRequest;
    
    console.log('Requesting token with scopes:', tokenRequest.scopes);
    console.log('Token strategy:', useCustomScopes ? 'Custom API' : 'Microsoft Graph');

    try {
      // Try to get token silently first
      const response = await this.msalInstance.acquireTokenSilent({
        scopes: tokenRequest.scopes,
        account: accounts[0],
      });
      
      console.log('Token acquired successfully:', {
        tokenType: useCustomScopes ? 'Custom API' : 'Microsoft Graph',
        audience: useCustomScopes ? `api://${CUSTOM_API_CLIENT_ID || 'YOUR_API_CLIENT_ID'}` : 'Microsoft Graph',
        expiresOn: response.expiresOn
      });
      
      return response.accessToken;
    } catch (error) {
      console.error("Failed to acquire access token silently:", error);
      
      // Provide more specific error guidance
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = (error as any).errorCode;
        
        if (errorCode === 'consent_required' || errorCode === 'interaction_required') {
          console.log('Interactive consent required, attempting popup...');
          
          try {
            const response = await this.msalInstance.acquireTokenPopup({
              scopes: tokenRequest.scopes,
              account: accounts[0],
            });
            
            console.log('Interactive token acquired successfully');
            return response.accessToken;
          } catch (interactiveError) {
            console.error("Interactive token acquisition failed:", interactiveError);
            
            if (useCustomScopes) {
              throw new Error(
                "Failed to acquire token for custom API. Please ensure:\n" +
                "1. Your backend API app registration is configured correctly\n" +
                "2. The API permissions include the required scope\n" +
                "3. Admin consent has been granted\n" +
                "4. VITE_CUSTOM_API_CLIENT_ID environment variable is set\n" +
                "\nAlternatively, set VITE_USE_CUSTOM_API_SCOPES=false to use Microsoft Graph tokens."
              );
            } else {
              throw new Error("Failed to acquire Microsoft Graph token. Please try signing in again.");
            }
          }
        }
        
        if (errorCode === 'invalid_grant' || errorCode === 'token_expired') {
          throw new Error("Your session has expired. Please sign out and sign in again.");
        }
      }
      
      // Generic error handling
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (useCustomScopes && errorMessage.includes('AADSTS650057')) {
        throw new Error(
          "Invalid resource scope. The custom API scope is not configured correctly. " +
          "Please check your Azure AD app registration or set VITE_USE_CUSTOM_API_SCOPES=false."
        );
      }
      
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
  }

  async sendMessage(userMessage: string): Promise<string> {
    if (!userMessage.trim()) {
      throw new Error("Message cannot be empty");
    }

    try {
      // Get JWT token from MSAL
      const accessToken = await this.getAccessToken();

      // Prepare request payload
      const requestBody: ChatRequest = {
        userMessage: userMessage.trim()
      };

      // Make API call
      const response = await fetch(`${API_BASE_URL}${CHAT_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'Accept': '*/*'
        },
        body: JSON.stringify(requestBody)
      });

      // Check if request was successful
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse response
      const data: ChatResponse = await response.json();
      
      if (!data.response) {
        throw new Error("Invalid response format: missing 'response' field");
      }

      return data.response;
    } catch (error) {
      console.error("Chat service error:", error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Failed to connect to chat service. Please ensure the backend is running on localhost:5280");
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("An unexpected error occurred while sending the message");
    }
  }

  // Health check method to verify backend connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      return response.ok;
    } catch (error) {
      console.warn("Health check failed:", error);
      return false;
    }
  }

  // Debug method to decode and display JWT token information
  async debugToken(): Promise<void> {
    try {
      const token = await this.getAccessToken();
      const useCustomScopes = getEffectiveTokenStrategy();
      
      // Decode JWT token (without verification - for debugging only)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      
      console.log('🔍 JWT Token Debug Information:');
      console.log('=====================================');
      console.log('Token Type:', useCustomScopes ? 'Custom API Token' : 'Microsoft Graph Token');
      console.log('Audience (aud):', payload.aud);
      console.log('Application ID (appid):', payload.appid);
      console.log('Tenant ID (tid):', payload.tid);
      console.log('User ID (oid):', payload.oid);
      console.log('Username (upn):', payload.upn);
      console.log('Scopes (scp):', payload.scp);
      console.log('Issued At (iat):', new Date(payload.iat * 1000).toISOString());
      console.log('Expires At (exp):', new Date(payload.exp * 1000).toISOString());
      console.log('=====================================');
      
      // Provide backend configuration guidance
      if (useCustomScopes) {
        const expectedAudience = `api://${CUSTOM_API_CLIENT_ID || 'YOUR_API_CLIENT_ID'}`;
        console.log('✅ Using Custom API Token - Your backend should validate this token');
        console.log('Backend Configuration Required:');
        console.log(`- Expected audience: ${expectedAudience}`);
        console.log(`- Current audience: ${payload.aud}`);
        console.log(`- Match: ${payload.aud === expectedAudience ? '✅ YES' : '❌ NO'}`);
        
        if (payload.aud !== expectedAudience) {
          console.log('⚠️ AUDIENCE MISMATCH - This will cause 401 Unauthorized errors');
          console.log('Solutions:');
          console.log('1. Update VITE_CUSTOM_API_CLIENT_ID in .env.local');
          console.log('2. Or configure backend to accept current audience');
          console.log('3. Or set VITE_USE_CUSTOM_API_SCOPES=false to use Graph tokens');
        }
      } else {
        console.log('⚠️ Using Microsoft Graph Token');
        console.log('Backend Options:');
        console.log('1. Configure backend to accept Graph tokens (audience: 00000003-0000-0000-c000-000000000000)');
        console.log('2. Or set VITE_USE_CUSTOM_API_SCOPES=true and configure custom API scope');
        console.log(`Current audience: ${payload.aud}`);
        console.log('Expected Graph audience: 00000003-0000-0000-c000-000000000000');
        console.log(`Match: ${payload.aud === '00000003-0000-0000-c000-000000000000' ? '✅ YES' : '❌ NO'}`);
      }
      
    } catch (error) {
      console.error('Failed to debug token:', error);
    }
  }

  // Method to switch token strategy without restarting
  setTokenStrategy(useCustomApiScopes: boolean): void {
    // Note: This is a runtime configuration change
    // In a real application, this should be set via environment variables or configuration
    (window as any).USE_CUSTOM_API_SCOPES = useCustomApiScopes;
    console.log(`Token strategy changed to: ${useCustomApiScopes ? 'Custom API' : 'Microsoft Graph'}`);
    console.log('You may need to clear your browser cache and re-authenticate for this to take effect.');
  }
}

// Export singleton instance
export const chatService = new ChatService();