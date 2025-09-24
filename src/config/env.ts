// Environment configuration helper
export const env = {
  // Azure AD Configuration
  AZURE_CLIENT_ID: import.meta.env.VITE_AZURE_CLIENT_ID,
  AZURE_TENANT_ID: import.meta.env.VITE_AZURE_TENANT_ID,
  AZURE_AUTHORITY: import.meta.env.VITE_AZURE_AUTHORITY,
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
  POST_LOGOUT_REDIRECT_URI: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  
  // API Configuration
  API_CLIENT_ID: import.meta.env.VITE_API_CLIENT_ID,
  
  // Azure OpenAI Configuration
  AZURE_OPENAI_ENDPOINT: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_API_KEY: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_MODEL_NAME: import.meta.env.VITE_AZURE_OPENAI_MODEL_NAME,
  AZURE_OPENAI_DEPLOYMENT: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT,
  AZURE_OPENAI_API_VERSION: import.meta.env.VITE_AZURE_OPENAI_API_VERSION,
  
  // Development flags
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};

// Validation helper
export const validateEnv = () => {
  const required = [
    'AZURE_CLIENT_ID',
    'AZURE_TENANT_ID',
  ];
  
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
};

export default env;