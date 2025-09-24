# Copilot Instructions for azure-ai-foundry-demos

## Project Overview
This is a React + TypeScript web application scaffolded with Vite. It demonstrates Azure AI Foundry integration, authentication flows, and chat services. The codebase is modular, with clear separation between UI components, API integrations, configuration, and utility logic.

## Key Architectural Patterns
- **Component Structure:**
  - UI components are in `src/components/` and `src/components/ui/`.
  - API integrations are in `src/api/` (e.g., `azureOpenAI.ts`, `chatService.ts`).
  - Configuration and environment logic are in `src/config/`.
  - Shared utilities are in `src/lib/`.
  - Type definitions are in `src/types/`.
- **Authentication:**
  - Auth flows are handled via components like `AuthLandingPage.tsx`, `LoginButton.tsx`, and config files in `src/config/`.
  - See `AUTHENTICATION_SETUP_GUIDE.md`, `ENTRA_ID_SETUP_GUIDE.md`, and `AZURE_AD_SETUP.md` for integration details.
- **Chat & AI Integration:**
  - Chat logic is in `src/components/chat.tsx` and API calls in `src/api/chatService.ts`.
  - Azure OpenAI integration is in `src/api/azureOpenAI.ts`.

## Developer Workflows
- **Build & Run:**
  - Use Vite for local development: `npm run dev`.
  - Production build: `npm run build`.
- **Linting:**
  - ESLint is configured via `eslint.config.js`.
  - Type-aware linting uses `tseslint.configs.recommendedTypeChecked`, `strictTypeChecked`, and `stylisticTypeChecked`.
  - For React-specific linting, consider `eslint-plugin-react-x` and `eslint-plugin-react-dom`.
- **TypeScript:**
  - Multiple tsconfig files: `tsconfig.app.json` (main app), `tsconfig.node.json` (node-specific).

## Project-Specific Conventions
- **File Naming:** Use PascalCase for components, camelCase for functions/variables.
- **Component Organization:** Place shared UI primitives in `src/components/ui/`.
- **Config Separation:** Keep environment/auth config in `src/config/`.
- **No global state management library (e.g., Redux) detected; use React context/hooks for state sharing.

## Integration Points
- **Azure Services:**
  - Authentication and AI services are integrated via custom API modules and config files.
  - Refer to the setup guides in the root for Azure/Entra ID/OpenAI configuration.
- **External Dependencies:**
  - React, Vite, TypeScript, ESLint, Azure SDKs (see `package.json`).

## Examples
- To add a new API integration, create a file in `src/api/` and export functions for network calls.
- To add a new UI component, place it in `src/components/` or `src/components/ui/` and follow existing patterns.
- For authentication changes, update config in `src/config/authConfig.ts` and related components.

## References
- [README.md](../../README.md)
- [AUTHENTICATION_SETUP_GUIDE.md](../../AUTHENTICATION_SETUP_GUIDE.md)
- [AZURE_AD_SETUP.md](../../AZURE_AD_SETUP.md)
- [ENTRA_ID_SETUP_GUIDE.md](../../ENTRA_ID_SETUP_GUIDE.md)
- [AZURE_OPENAI_README.md](../../AZURE_OPENAI_README.md)
- [CHAT_SERVICE_README.md](../../CHAT_SERVICE_README.md)

---

**Feedback:** If any section is unclear or missing, please specify which workflows, conventions, or architectural details need further documentation.