/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_OPENAI_ENDPOINT: string
  readonly VITE_AZURE_OPENAI_MODEL_NAME: string
  readonly VITE_AZURE_OPENAI_DEPLOYMENT: string
  readonly VITE_AZURE_OPENAI_API_VERSION: string
  readonly VITE_CHAT_API_URL: string
  readonly VITE_USE_CUSTOM_API_SCOPES: string
  readonly VITE_CUSTOM_API_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
