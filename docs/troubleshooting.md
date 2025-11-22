# Troubleshooting & Known Issues
**Date:** 2025-05-15
**Project:** Canvas-AI-Logic

This document outlines known issues reported by users and recommended solutions for future development.

---

## 1. PNG Export Fails (FIXED)
**Status:** Resolved in Epic 5.1.
The export logic was updated to target the stable ID `canvas-export-root` provided by the `CanvasWidget`.

---

## 2. Graph Ignores Prompts (Stuck on "Sales Funnel")
**Symptom:**
Regardless of the user's prompt (e.g., "как печь хлеб"), the generated graph always displays a "Sales Funnel" (Lead Capture -> Qualify Lead -> CRM Update). The Chat Assistant confirms "I have updated the graph", but only adds a generic node.

**Cause:**
The application is running in **Mock Mode**. This happens when the `GeminiConnector` cannot be initialized, usually because the API Key is missing.
The `src/di.ts` file checks for the key:
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ...;
const aiConnector = apiKey ? new GeminiConnector(apiKey) : new MockAIConnector();
```
If `apiKey` is undefined, it defaults to `MockAIConnector`, which contains hardcoded "Sales Funnel" data.

**Solution (For Users/Developers):**
1.  Ensure a `.env` file exists in the project root.
2.  Ensure it contains the valid key with the `VITE_` prefix:
    ```env
    VITE_GEMINI_API_KEY=AIzaSy...
    ```
3.  **Restart the development server** (`npm run dev`). Vite loads environment variables only on startup.

---

## 3. "Process is not defined" Crash
**Symptom:**
White screen on startup or tests failing with `ReferenceError: process is not defined`.

**Cause:**
Direct access to `process.env` in client-side code (`src/di.ts`).

**Status:**
**Fixed** in `src/di.ts` by adding a guard check: `typeof process !== 'undefined'`.

---

## 4. API Quota Exceeded / 429 Errors
**Symptom:**
The chat interface shows a loading spinner indefinitely or returns an error message immediately after sending a prompt.
Console logs show: `GoogleGenerativeAIError: [429] Resource has been exhausted (e.g. check quota)`.

**Cause:**
The Gemini API free tier has a limit of 15 requests per minute (RPM) or a daily token limit.

**Solution:**
- Wait a minute before trying again.
- Check the [Google AI Studio dashboard](https://aistudio.google.com/) for usage stats.
- Implement retry logic with exponential backoff in `GeminiConnector.ts` (currently not implemented).

---

## 5. Corrupted State / White Screen
**Symptom:**
The application loads a blank white screen, even after refreshing. Console might show errors related to `nodes[id] is undefined` or JSON parsing errors.

**Cause:**
The application persists the graph state to `localStorage` under the key `canvas-ai-storage`. If the data structure (schema) of `NodeEntity` or `EdgeEntity` changes during development, the stored data might become incompatible with the new code.

**Solution:**
Clear the local storage:
1.  Open DevTools (F12) -> Application -> Local Storage.
2.  Right-click `canvas-ai-storage` and select "Delete".
3.  Refresh the page.

---

## 6. Safari / Mobile Export Issues
**Symptom:**
PNG Export results in a blank image or incorrect text rendering on Safari or iOS.

**Cause:**
The `html-to-image` library relies on SVG `foreignObject`, which has strict security implementation details in WebKit (Safari). It may fail to render external resources or complex CSS transforms.

**Solution:**
- No immediate fix. Known limitation of the library on WebKit.
- Ensure all fonts are loaded locally (not from CDN) to improve chances of success.
