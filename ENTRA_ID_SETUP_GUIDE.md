# Azure AD (Entra ID) Authentication Setup

This guide will help you configure Azure AD authentication for your React application.

## Prerequisites

- Azure subscription with appropriate permissions
- Ability to register applications in Azure AD
- Node.js and npm installed

## Step 1: Azure App Registration

### 1.1 Register a New Application

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **+ New registration**

### 1.2 Configure Basic Settings

- **Name**: `Azure AI Foundry Demos` (or your preferred name)
- **Supported account types**: Choose based on your needs:
  - `Accounts in this organizational directory only` (Single tenant - recommended for internal apps)
  - `Accounts in any organizational directory` (Multi-tenant)
  - `Accounts in any organizational directory and personal Microsoft accounts` (Widest access)
- **Redirect URI**: 
  - Platform: `Single-page application (SPA)`
  - URL: `http://localhost:5173`

### 1.3 Note Important Values

After registration, copy these values from the **Overview** page:
- **Application (client) ID** - You'll need this for `VITE_AZURE_CLIENT_ID`
- **Directory (tenant) ID** - You'll need this for `VITE_AZURE_TENANT_ID`

## Step 2: Configure Authentication Settings

### 2.1 Authentication Configuration

1. In your app registration, go to **Authentication**
2. Under **Single-page application**, verify `http://localhost:5173` is listed
3. Add production URLs when deploying (e.g., `https://yourapp.azurewebsites.net`)
4. Under **Advanced settings**:
   - **Allow public client flows**: Keep as `No` (more secure)
   - **Live SDK support**: Keep as `No`

### 2.2 Optional: Configure Additional Redirect URIs

Add any additional URLs where your app will be hosted:
- Development: `http://localhost:3000`, `http://localhost:5173`
- Staging: `https://yourapp-staging.azurewebsites.net`
- Production: `https://yourapp.com`

## Step 3: Configure API Permissions

### 3.1 Basic Microsoft Graph Permissions

1. Go to **API permissions**
2. You should see `Microsoft Graph - User.Read` by default
3. If not present, click **+ Add a permission**:
   - Choose **Microsoft Graph**
   - Select **Delegated permissions**
   - Check **User.Read**
   - Click **Add permissions**



### 3.3 Grant Admin Consent

1. Click **Grant admin consent for [Your Organization]**
2. Click **Yes** to confirm
3. Verify you see green checkmarks next to all permissions

## Step 4: Configure Environment Variables

### 4.1 Update .env File

Replace the placeholder values in your `.env` file:

```env
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-client-id-from-step-1.3
VITE_AZURE_TENANT_ID=your-tenant-id-from-step-1.3
VITE_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id-from-step-1.3
VITE_REDIRECT_URI=http://localhost:5173
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173

# If you have a custom API backend
VITE_API_CLIENT_ID=your-api-client-id


```



## Step 5: Test the Configuration

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Authentication Flow

1. Open `http://localhost:5173` in your browser
2. You should see the sign-in landing page
3. Click **Sign In** button
4. Complete the Microsoft authentication flow
5. You should be redirected back to the app and see the main interface

### 5.3 Debug Authentication Issues

If you encounter issues:

1. **Check Browser Console**: Look for MSAL errors or network issues
2. **Validate Environment Variables**: Ensure all required variables are set
3. **Check Azure AD Logs**: Go to Azure AD → Sign-in logs to see authentication attempts
4. **Verify Redirect URI**: Make sure the redirect URI matches exactly
5. **Clear Browser Cache**: Clear cookies and local storage for your domain

## Step 6: Production Deployment

### 6.1 Update Redirect URIs

1. Add your production URL to the app registration's redirect URIs
2. Update environment variables for production:

```env
VITE_REDIRECT_URI=https://yourapp.com
VITE_POST_LOGOUT_REDIRECT_URI=https://yourapp.com
```

### 6.2 Security Considerations

- **Never commit sensitive values** to source control
- **Use Key Vault** or secure environment variable management in production
- **Enable HTTPS** for all production URLs
- **Review API permissions** regularly and follow principle of least privilege

## Troubleshooting



### Environment Validation

The app includes environment validation. Check the browser console for missing required variables.

### Debug Tools

- Use the `/debug` route in your app to see authentication status
- Check `AuthDebugger` component for detailed token information
- Monitor network requests in browser DevTools

## Advanced Configuration

### Custom API Backend

If you have a custom API, you'll need to:

1. Create a separate app registration for your API
2. Expose scopes in the API app registration
3. Add API permissions to your client app registration
4. Configure your backend to validate tokens

See the existing documentation files for detailed backend integration examples.

### Multi-tenant Applications

For multi-tenant apps:
- Use `https://login.microsoftonline.com/common` as authority
- Handle tenant resolution in your application
- Consider additional security measures

## Support

- **Microsoft Identity Documentation**: https://docs.microsoft.com/en-us/azure/active-directory/develop/
- **MSAL.js Documentation**: https://github.com/AzureAD/microsoft-authentication-library-for-js
- **Azure AD Troubleshooting**: https://docs.microsoft.com/en-us/azure/active-directory/develop/troubleshoot-publisher-verification