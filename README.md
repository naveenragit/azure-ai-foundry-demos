
# Azure AI Foundry Demos

This is a React + TypeScript web application demonstrating Azure AI Foundry integration, authentication with Entra ID (Azure AD), and chat services. The project is scaffolded with Vite and follows modern best practices for modular, cloud-connected apps.

## Features

- Azure OpenAI integration (no API key required)
- Entra ID (Azure AD) authentication
- Modular React component structure
- Example chat and AI service usage

## Prerequisites

- [Node.js (LTS)](https://nodejs.org/) and npm
- Azure subscription with permission to register applications (for authentication)

## Getting Started

See [GETTING_STARTED.md](./GETTING_STARTED.md) for step-by-step instructions to:

- Install Node.js and npm
- Install dependencies (`npm install`)
- Run the development server (`npm run dev`)

## Authentication & App Registration

You must register an application in Entra ID (Azure AD) and configure environment variables for authentication.

See [ENTRA_ID_SETUP_GUIDE.md](./ENTRA_ID_SETUP_GUIDE.md) for detailed instructions on:

- Registering your app in Azure
- Setting redirect URIs
- Assigning API permissions
- Configuring your `.env` file

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values. See the setup guide for details.

## Project Structure

- `src/components/` — React UI components
- `src/api/` — API integration modules
- `src/config/` — Auth and environment config
- `src/lib/` — Shared utilities
- `src/types/` — TypeScript types

## Troubleshooting

- Check the browser console for errors
- Validate your environment variables
- See the `/debug` route for authentication status
- Review the setup guides for common issues

## Documentation

- [GETTING_STARTED.md](./GETTING_STARTED.md): Local setup and running the app
- [ENTRA_ID_SETUP_GUIDE.md](./ENTRA_ID_SETUP_GUIDE.md): Authentication and app registration
- [AUTHENTICATION_SETUP_GUIDE.md](./AUTHENTICATION_SETUP_GUIDE.md): Additional auth details
- [AZURE_OPENAI_README.md](./AZURE_OPENAI_README.md): Azure OpenAI integration
- [CHAT_SERVICE_README.md](./CHAT_SERVICE_README.md): Chat service usage

## Support

- [Microsoft Identity Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)

