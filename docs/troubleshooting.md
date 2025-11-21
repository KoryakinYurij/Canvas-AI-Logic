# Troubleshooting & Known Issues
**Date:** 2025-05-15
**Project:** Canvas-AI-Logic

This document outlines known issues reported by users and recommended solutions for future development.

---

## 1. PNG Export Fails
**Symptom:**
When clicking the "Export PNG" button in the Chat Sidebar, an alert appears:
> "Could not find canvas element to export."

**Cause:**
The export logic in `ChatSidebar.tsx` attempts to find the canvas using a class selector specific to the `react-zoom-pan-pinch` library:
```typescript
const node = document.querySelector('.react-transform-component') as HTMLElement;
```
If the library updates its class names, or if the DOM structure changes (e.g., the component is wrapped differently), this selector returns `null`.

**Recommendation:**
1.  Modify `src/widget/canvas/CanvasWidget.tsx` to wrap the `TransformComponent` in a `div` with a stable ID (e.g., `id="canvas-export-target"`).
2.  Update `src/presentation/organisms/ChatSidebar.tsx` to select by this ID:
    ```typescript
    const node = document.getElementById('canvas-export-target');
    ```

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
