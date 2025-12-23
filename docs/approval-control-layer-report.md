# Approval & Control Layer Report

**Date:** 2025-05-15
**Task:** Implement Explicit Human Control Layer

## 1. Implementation Details

### A. Proposal State (`useProposalStore.ts`)
*   Created a lightweight Zustand store to manage the `queue` of pending `GraphAction`s.
*   Functions: `addProposals`, `dismissCurrent`, `clearQueue`.
*   This ensures strict FIFO processing of AI proposals.

### B. Control UI (`ProposalReview.tsx`)
*   Implemented a floating UI component that displays:
    *   **The Proposal:** Visual description of the pending action (e.g., "Add Node: [Title]").
    *   **Controls:** "Approve" (Green Check) and "Reject" (Red X) buttons.
    *   **Undo:** "Undo Last Change" button, visible only when `lastSnapshot` exists in the Graph Store.
*   **Behavior:**
    *   **Approve:** Calls `useGraphStore.applyAction(action)` -> Updates Graph -> Removes from Queue.
    *   **Reject:** Removes from Queue (No Graph Mutation).
    *   **Undo:** Calls `useGraphStore.undoLastAction()` -> Reverts Graph.

### C. Integration
*   **PromptInput:** Now pushes generated actions to `useProposalStore` instead of logging them.
*   **ChatSidebar:** Pushes refined actions to `useProposalStore` while maintaining the conversational UI.
*   **App:** Renders `ProposalReview` globally, ensuring control is available in both "Empty" and "Canvas" states.

## 2. Control Flow Verification

The system now enforces the following strict loop:
1.  **AI Proposes:** `GeminiConnector` returns `GraphAction[]`.
2.  **Queue:** Actions are added to `useProposalStore`.
3.  **Review:** User sees *one* action at a time in `ProposalReview`.
4.  **Decision:**
    *   **Approve:** Action is applied to `GraphModel` (Mutation).
    *   **Reject:** Action is discarded (No Mutation).
5.  **Safety:** User can click "Undo" to revert the last approved action.

## 3. Compliance Checklist
*   [x] AI never applies actions automatically.
*   [x] User must explicitly approve every change.
*   [x] Undo is preserved and integrated into the control layer.
*   [x] "One at a time" flow is enforced via the queue mechanism.
