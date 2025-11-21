import { MockAIConnector } from '@infrastructure/ai/MockAIConnector';
import { GenerateGraphUseCase } from '@domain/usecases/GenerateGraph';
import { RefineGraphUseCase } from '@domain/usecases/RefineGraphUseCase';

// Singleton instances
const aiConnector = new MockAIConnector();

export const generateGraphUseCase = new GenerateGraphUseCase(aiConnector);
export const refineGraphUseCase = new RefineGraphUseCase(aiConnector);
