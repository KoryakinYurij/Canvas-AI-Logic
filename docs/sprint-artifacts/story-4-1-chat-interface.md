# Story 4-1: Implement Chat Interface for Refinement

**Epic:** 4 - Graph Refinement & Management
**Story Owner:** Developer
**Estimate:** 3
**Status:** Ready for Development

## 1. Description
As a User,
I want a sidebar chat interface,
So that I can ask the AI to modify the graph.

The user needs a way to converse with the system to refine the generated graph. This involves a sidebar UI where they can send messages, and the system processing those messages to update the graph structure.

## 2. Acceptance Criteria
- [ ] **UI - Sidebar:** A toggleable sidebar exists on the right side of the screen.
- [ ] **UI - Chat:** The sidebar contains a message history list and an input field with a submit button.
- [ ] **Interaction:** Typing a message and sending it triggers the refinement process.
- [ ] **Logic:** The message + current graph are sent to the AI Connector.
- [ ] **Feedback:** A loading indicator is shown while waiting for the AI response.
- [ ] **Result:** The graph updates with the changes returned by the AI (simulated in Mock).

## 3. Technical Plan

### 3.1 Infrastructure Layer
- **Modify `src/infrastructure/ai/MockAIConnector.ts`:**
    - Add `refineGraph(currentGraph, prompt)` method.
    - Implement a mock response that adds a new random node connected to an existing node to simulate "refinement".

### 3.2 Domain Layer
- **Create `src/domain/usecases/RefineGraphUseCase.ts`:**
    - Logic to call `aiConnector.refineGraph`.
    - Logic to update the `GraphStore` with the result.

### 3.3 Presentation Layer
- **Create `src/presentation/organisms/ChatSidebar.tsx`:**
    - Layout: Fixed/Absolute positioned sidebar on the right.
    - Components: Message List, Input Area.
    - State: Local state for input, Global state (or prop) for visibility.
- **Modify `src/presentation/pages/CanvasPage.tsx` (or equivalent):**
    - Add the `ChatSidebar` to the layout.
    - Add a button to toggle the sidebar.

## 4. Test Plan
- **Unit Test:** Test `RefineGraphUseCase` ensures it calls the connector and updates the store.
- **Component Test:** Verify `ChatSidebar` renders messages and triggers the submit handler.
