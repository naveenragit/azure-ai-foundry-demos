import { AzureOpenAI } from "openai";
import type { IPublicClientApplication, SilentRequest } from "@azure/msal-browser";
import type { 
  AzureOpenAIChatMessage, 
  AzureOpenAIChatCompletionOptions, 
  AzureOpenAIChatCompletionResponse 
} from "../types";

// Environment variables
const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const modelName = import.meta.env.VITE_AZURE_OPENAI_MODEL_NAME || "gpt-4";
const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

class AzureOpenAIService {
  private client: AzureOpenAI | null = null;
  private msalInstance: IPublicClientApplication | null = null;
  private isInitialized = false;

  public setMsalInstance(instance: IPublicClientApplication): void {
    this.msalInstance = instance;
    // Reset client when MSAL instance changes
    this.client = null;
    this.isInitialized = false;
  }

  private async getAccessToken(): Promise<string> {
    if (!this.msalInstance) {
      throw new Error("MSAL instance not set. Please call setMsalInstance() first.");
    }

    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error("No authenticated user found. Please sign in first.");
    }

    const request: SilentRequest = {
      scopes: ["https://cognitiveservices.azure.com/.default"],
      account: accounts[0],
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      console.error("Failed to acquire access token silently:", error);
      
      // Check if the error is due to missing API permissions
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = (error as any).errorCode;
        if (errorCode === 'user_null' || errorCode === 'interaction_required') {
          throw new Error("Please sign in again to access Azure OpenAI services.");
        }
      }
      
      // For other errors, provide more specific guidance
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('AADSTS650057') || errorMessage.includes('invalid_client')) {
        throw new Error(
          "Azure AD application registration issue: The app needs to be granted permissions to access Azure Cognitive Services. " +
          "Please contact your administrator to add the 'Azure Cognitive Services' API permission to the app registration."
        );
      }
      
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
  }

  private async initializeClient(): Promise<void> {
    if (this.isInitialized && this.client) {
      return;
    }

    try {
      const accessToken = await this.getAccessToken();
      
      const options = {
        endpoint,
        apiKey: `Bearer ${accessToken}`,
        apiVersion,
      };

      this.client = new AzureOpenAI(options);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Azure OpenAI client:", error);
      throw new Error("Failed to initialize Azure OpenAI client");
    }
  }

  async createChatCompletion(options: AzureOpenAIChatCompletionOptions): Promise<AzureOpenAIChatCompletionResponse> {
    await this.initializeClient();
    
    if (!this.client) {
      throw new Error("Azure OpenAI client not initialized");
    }

    try {
      const response = await this.client.chat.completions.create({
        messages: options.messages,
        max_completion_tokens: options.maxCompletionTokens || 16384,
        model: modelName,
        temperature: options.temperature,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
      });

      // Transform the response to match our interface
      const transformedResponse: AzureOpenAIChatCompletionResponse = {
        choices: response.choices.map(choice => ({
          message: {
            content: choice.message?.content || null,
            role: choice.message?.role || "assistant"
          },
          finishReason: choice.finish_reason || null
        })),
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      };

      return transformedResponse;
    } catch (error) {
      console.error("Error creating chat completion:", error);
      
      // Check if it's an authentication error and reset client
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
        this.isInitialized = false;
        this.client = null;
        throw new Error("Authentication failed. Please try again.");
      }
      
      throw error;
    }
  }

  async askQuestion(question: string, systemPrompt?: string): Promise<string> {
    const messages: AzureOpenAIChatMessage[] = [
      { 
        role: "system", 
        content: systemPrompt || "You are a helpful assistant." 
      },
      { 
        role: "user", 
        content: question 
      }
    ];

    const response = await this.createChatCompletion({ messages });
    
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content || "No response generated";
    }
    
    throw new Error("No response received from Azure OpenAI");
  }
}

// Export a singleton instance
export const azureOpenAIService = new AzureOpenAIService();

// Example usage function (equivalent to your main function)
export async function exampleUsage(): Promise<void> {
  try {
    const response = await azureOpenAIService.askQuestion(
      "I am going to Paris, what should I see?",
      "You are a helpful travel assistant."
    );
    
    console.log("Response:", response);
  } catch (error) {
    console.error("The sample encountered an error:", error);
  }
}