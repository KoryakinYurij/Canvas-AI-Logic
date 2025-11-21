# Story 2-3: Real AI Connector Implementation

**Epic:** 2 - AI Graph Generation
**Story Owner:** Developer
**Estimate:** 3
**Status:** Ready for Development

## 1. Description
As a User,
I want the system to generate real, intelligent graphs based on my prompts,
So that I get useful results instead of mocked data.

## 2. Acceptance Criteria
- [ ] **Integration:** `OpenAIConnector` is implemented using the `openai` package.
- [ ] **Configuration:** It uses `GEMINI_API_KEY` (or `OPENAI_API_KEY` if user provided) from environment variables.
    - *Note:* Since the environment has `GEMINI_API_KEY`, I will configure the OpenAI client to point to Gemini's OpenAI-compatible endpoint if possible, or use the Google Generative AI SDK. *Constraint check:* The `openai` package is already installed. I should try to use the OpenAI client with Gemini base URL if supported, or just fallback to standard OpenAI if the key is actually for OpenAI.
    - *Clarification:* The user said "real key" and pointed to `GEMINI_API_KEY`. I will assume I need to use Google's Generative AI, but the package.json only has `openai`. I will install `@google/generative-ai` if needed, or stick to `openai` if the key is for OpenAI.
    - *Decision:* I will implement `GeminiConnector` using `openai` library if compatible (Gemini offers an OpenAI-compatible API), otherwise I will create a standard fetch-based implementation for Gemini REST API to avoid adding heavy dependencies if `openai` isn't enough.
    - *Actually:* Recent Gemini API is compatible with OpenAI client by changing the `baseURL`.
- [ ] **Prompting:** The prompt template ensures the LLM returns valid JSON matching the schema.
- [ ] **Switching:** The app uses the real connector when the API Key is present.

## 3. Technical Plan
- **Create `src/infrastructure/ai/GeminiConnector.ts`:**
    - Implement `AIConnector` interface.
    - Use `openai` client configured with `baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'` and `apiKey: GEMINI_API_KEY`.
- **Update `src/di.ts`:**
    - Check `import.meta.env.GEMINI_API_KEY`.
    - If present, instantiate `GeminiConnector`, else `MockAIConnector`.

## 4. Test Plan
- **Manual:** Run the app with the env var and generate a graph.
