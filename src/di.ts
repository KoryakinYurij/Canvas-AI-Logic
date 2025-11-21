import { MockAIConnector } from '@infrastructure/ai/MockAIConnector';
import { GeminiConnector } from '@infrastructure/ai/GeminiConnector';
import { GenerateGraphUseCase } from '@domain/usecases/GenerateGraph';
import { RefineGraphUseCase } from '@domain/usecases/RefineGraphUseCase';

// Singleton instances
// Safely access process.env for test environments, while preferring VITE_ env for client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);

const aiConnector = apiKey
  ? new GeminiConnector(apiKey)
  : new MockAIConnector();

if (!apiKey) {
  console.warn('Using MockAIConnector. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY to use real AI.');
}

export const generateGraphUseCase = new GenerateGraphUseCase(aiConnector);
export const refineGraphUseCase = new RefineGraphUseCase(aiConnector);
