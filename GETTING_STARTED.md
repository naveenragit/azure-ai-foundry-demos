# Getting Started: Local Development Setup

Follow these steps to set up and run the application locally.

## 1. Install Node.js

- Download and install the latest LTS version of Node.js from the official website:
  - https://nodejs.org/
- This will also install npm (Node Package Manager) automatically.

## 2. Verify Node.js and npm Installation

Open a terminal or command prompt and run:

```sh
node --version
npm --version
```

You should see version numbers for both Node.js and npm.

## 3. Install Project Dependencies

Navigate to the project root directory and run:

```sh
npm install
```

This will install all required packages listed in `package.json`.

## 4. Start the Development Server

Run the following command to start the app in development mode:

```sh
npm run dev
```

- The app will be available at the URL shown in the terminal (usually http://localhost:5173).
- Any code changes will automatically reload the app.

## Troubleshooting

- If you encounter issues, ensure you are using a supported Node.js version (LTS recommended).
- Delete the `node_modules` folder and run `npm install` again if dependencies fail to install.
- For Windows users, use PowerShell or Command Prompt for commands.

---

For more details, see the main `README.md`.
