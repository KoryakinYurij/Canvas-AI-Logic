# Epic 4: Graph Refinement & Management - Technical Context

**Epic Owner:** Architect
**Date:** 2025-05-15
**Status:** Contexted

## 1. Introduction
Epic 4 focuses on making the generated knowledge graph interactive and mutable. While Epic 2 provided the initial "Text-to-Graph" generation and Epic 3 provided the visualization, Epic 4 closes the loop by allowing the user to refine the result.

The primary component of this epic is the **Chat Interface**, which acts as a secondary command channel for the AI. Unlike the initial "Brain Dump", the Chat Interface needs to be aware of the *current* state of the graph to perform incremental updates (Add, Remove, Update nodes/edges).

## 2. Architecture Overview

### 2.1 Presentation Layer
- **ChatSidebar (Organism):** A collapsible sidebar containing the message history and input field.
- **ChatMessage (Molecule):** Displays user or AI messages.
- **ChatInput (Molecule):** Input field with send button.
- **State Management:** Needs to manage `isOpen`, `messages`, and `isTyping` state.

### 2.2 Domain Layer
- **GraphStore:** Already exists but needs to ensure it exposes methods to support *incremental* updates if the AI returns a diff, or full replacement if it returns a new graph.
- **New UseCase:** `RefineGraphUseCase`.
    - Input: `userPrompt`, `currentGraph`.
    - Output: `updatedGraph`.

### 2.3 Infrastructure Layer (AI Connector)
- **Method:** `refineGraph(currentGraph: Graph, prompt: string): Promise<Graph>`
- **Prompt Engineering:** The prompt must include the current JSON structure of the graph and instruction to modify it based on the user's request.
- **Mock Implementation:** The `MockAIConnector` needs to be updated to simulate refinements (e.g., adding a generic node when requested).

## 3. Technical Dependencies & Risks
- **Token Limits:** Sending the entire graph context in the prompt might hit token limits for large graphs. *Mitigation (MVP):* We assume small-to-medium graphs for now.
- **State Synchronization:** Ensuring the UI updates smoothly without "flashing" when the graph changes.
- **Layout Stability:** If the AI adds a node, `Elkjs` will re-calculate the layout. We need to ensure this doesn't completely disorient the user (though preserving positions is complex, auto-layout is acceptable for MVP).

## 4. Implementation Strategy
1.  **Story 4.1 (Chat Interface):** Implement the UI and the wire-up to the AI Connector.
2.  **Story 4.2 (Manual Edit):** Direct manipulation of nodes (Separate story).

## 5. Testing Strategy
- **Unit:** Test `RefineGraphUseCase` logic.
- **Integration:** Test the flow from `ChatInput` -> `UseCase` -> `MockAIConnector` -> `GraphStore`.
- **UI:** Verify the Sidebar toggles and messages appear.
