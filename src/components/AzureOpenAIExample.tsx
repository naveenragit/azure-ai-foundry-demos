import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { chatService } from '../api/chatService';

interface AzureOpenAIExampleProps {
  className?: string;
}

export const AzureOpenAIExample: React.FC<AzureOpenAIExampleProps> = ({ className }) => {
  const { instance } = useMsal();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize the chat service with the MSAL instance
    if (instance) {
      chatService.setMsalInstance(instance);
      setIsInitialized(true);
    }
  }, [instance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!isInitialized) {
      setError('Service not initialized. Please try again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await chatService.sendMessage(question);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while getting the response');
      console.error('Chat Service Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
    setError(null);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Chat with AI Assistant
        </h2>
        
        {!isInitialized && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Initializing</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Setting up chat service with your authentication...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Ask a question:
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the best places to visit in Paris?"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[100px]"
              disabled={isLoading || !isInitialized}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading || !question.trim() || !isInitialized}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Getting Response...' : 'Ask Question'}
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Response:</h3>
            <div className="bg-gray-50 p-4 rounded-md border">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {response}
              </pre>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Processing your request...</span>
          </div>
        )}
      </div>
    </div>
  );
};