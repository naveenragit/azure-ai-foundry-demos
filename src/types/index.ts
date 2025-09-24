/**
 * Chat message interface for conversation handling
 */
export interface ChatMessage {
    sender: 'user' | 'agent';
    text: string;
}

/**
 * Prompt interface for movie character interactions
 */
export interface Prompt {
    movieName: string;
    characterName: string;
    userPrompt: string;
    chatHistory?: string;  
}

/**
 * Response interface for API responses and character interactions
 */
export interface Response {
    movieName?: string;
    characterName?: string;
    response?: string;
    chatHistory?: string;
    chatacterScriptName?: string;
    vectorEmbedding?: number[];
    searchResult?: string;
}

// Azure OpenAI Types
export interface AzureOpenAIConfig {
    endpoint: string;
    modelName: string;
    deployment: string;
    apiVersion: string;
}

export interface AzureOpenAIChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AzureOpenAIChatCompletionOptions {
    messages: AzureOpenAIChatMessage[];
    maxCompletionTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

export interface AzureOpenAIChatCompletionResponse {
    choices: {
        message: {
            content: string | null;
            role: string;
        };
        finishReason: string | null;
    }[];
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}