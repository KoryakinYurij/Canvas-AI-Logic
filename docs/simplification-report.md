# Simplification Execution Report

**Date:** 2025-05-15
**Task:** Delete & Simplify (SPEC-1 Alignment)

## 1. Executed Changes

### A. Removed Functionality
*   **Export Logic:** Deleted `handleExportJSON` and `handleExportPNG` from `ChatSidebar.tsx`.
*   **Export Artifacts:** Removed `html-to-image` dependency and the `canvas-export-root` ID / 5000px hack from `CanvasWidget.tsx`.
*   **Demo Artifacts:** Removed the hardcoded "Sales Funnel" logic from `MockAIConnector.ts`.

### B. Simplified Logic (Atomic Proposals)
*   **Data Structure:** Defined `GraphAction` (ADD_NODE, REMOVE_NODE, etc.) in `AIConnector.ts`.
*   **AI Connector:**
    *   Updated `GeminiConnector` to prompt for atomic actions (`GraphAction[]`) instead of full graph JSON.
    *   Simplified `refineGraph` to return proposals without graph-wide regeneration.
*   **Use Cases:**
    *   Refactored `GenerateGraphUseCase` to return `Promise<GraphAction[]>` instead of mutating the store.
    *   Refactored `RefineGraphUseCase` to return `AIResponse` (proposal) instead of mutating the store.
*   **Mocking:**
    *   Updated `MockAIConnector` to return lists of `GraphAction` proposals instead of full `GraphModel` objects.

### C. Architecture Preservation
*   Retained `GraphModel` and `useGraphStore` structure.
*   Retained `CanvasWidget` rendering logic (minus export hack).
*   Callers (`PromptInput`, `ChatSidebar`) now receive the proposals and log/toast them, adhering to the "No Code Changes to UI Flows" constraint (they do not yet show an approval UI).

## 2. Verification
*   **Linting:** `npm run lint` passes (0 errors, 0 warnings).
*   **Type Safety:** Interfaces in `domain/ports/AIConnector.ts` are strictly typed.

## 3. Next Steps (Pending Features)
*   **Approval UI:** Implement a UI to display the proposed `GraphAction[]` to the user.
*   **Undo/Redo:** Implement the undo history in `useGraphStore` or via a middleware.
*   **Action Application:** Implement the logic to apply approved actions to the store (reducers).
