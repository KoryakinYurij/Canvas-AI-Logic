# Canvas-AI-Logic - Product Requirements Document

**Author:** BMad
**Date:** 2025-05-15
**Version:** 1.0

---

## Executive Summary

The Interactive AI Canvas is a web-based knowledge management tool that transforms unstructured text, documents, and ideas into structured, visual knowledge graphs. It leverages AI to automatically generate nodes and connections, organizing them into a logical layout. The system empowers users to interactively refine these graphs through natural language dialogue, bridging the gap between "messy thoughts" and "structured diagrams." It is built on a multi-layered Clean Architecture with Atomic Design principles to ensure scalability and maintainability.

### What Makes This Special

The core differentiator is the **AI-First Generation** combined with **Interactive Refinement**. Unlike traditional tools where users manually draw nodes, or static AI generators that produce a "dead" image, this system creates a living, editable graph model. Users can iterate on the structure ("Add a step here", "Expand on this node") as if collaborating with a human whiteboard partner. This is supported by a strict architectural separation that isolates the AI connector, ensuring the system remains robust even as AI models evolve.

---

## Project Classification

**Technical Type:** Web Application (React)
**Domain:** Productivity / Knowledge Management
**Complexity:** Medium

This project is a Single Page Application (SPA) built with React, focusing on data visualization and interactive AI chat.

### Domain Context

The domain is Knowledge Management and Visualization. Key concerns include the accuracy of AI interpretation, the usability of the graph (preventing "spaghetti" diagrams), and the intuitiveness of the layout algorithms.

---

## Success Criteria

1.  **Time-to-Visualization:** Users can generate a coherent graph from a raw text dump in under 30 seconds.
2.  **Refinement Efficiency:** Users can modify graph structures via chat commands with >90% intent accuracy.
3.  **Visual Clarity:** Auto-layout algorithms produce graphs with minimal edge crossings and overlapping nodes.
4.  **Scalability:** The UI maintains 60fps performance with graphs up to 100 nodes (via virtualization).

### Business Metrics

*   **User Retention:** Recurring usage for refining previously created graphs.
*   **Session Length:** Time spent interacting with the canvas (indicating engagement).

---

## Product Scope

### MVP - Minimum Viable Product

*   **Text-to-Graph:** Input text/documents and generate a node-edge graph via AI.
*   **Interactive Canvas:** Pan, zoom, and select nodes on an infinite canvas.
*   **AI Chat Interface:** Sidebar chat for sending refinement commands.
*   **Basic Node Types:** Standard "Topic", "Action", and "Note" nodes.
*   **Auto-Layout:** Integration of a layout engine (e.g., Dagre/Elkjs) for automatic positioning.
*   **4-Layer Architecture:** Implementation of Presentation, Widget, Domain, and Infrastructure layers.

### Growth Features (Post-MVP)

*   **Multi-User Collaboration:** Real-time co-editing of the canvas.
*   **Export Options:** Export to PNG, SVG, PDF, and Markdown.
*   **Custom Templates:** User-defined node styles and structures.
*   **History/Undo:** robust state management with undo/redo capabilities.

### Vision (Future)

*   **Deep Integrations:** Connect to Jira, Notion, or GitHub to auto-map project dependencies.
*   **Plugin Architecture:** Allow 3rd party developers to create custom node renderers.
*   **Semantic Zoom:** Reveal more detail as the user zooms in on nodes.

---

## User Experience Principles

*   **"AI as a Partner":** The AI is not just a tool but a collaborator. The chat interface should feel conversational.
*   **Direct Manipulation + Command:** Users should be able to click nodes to edit (Direct) OR tell the AI to change them (Command).
*   **Clean & Minimal:** The focus is on the content (the graph). The UI should recede. Use Atomic Design to ensure consistency.
*   **Fluidity:** Animations for layout changes should be smooth to help users track how the graph evolves.

### Key Interactions

1.  **Generation Flow:** User types prompt -> Loading Spinner -> Graph appears with animation.
2.  **Refinement Flow:** User selects node -> Types "Add detail" in chat -> New child nodes sprout from selection.
3.  **Navigation:** Scroll to zoom, drag to pan. Minimap for large graphs.

---

## Functional Requirements

**Canvas & Visualization**

- FR1: Users can view an infinite 2D canvas that hosts nodes and edges.
- FR2: Users can pan the canvas (drag) and zoom in/out (scroll/buttons).
- FR3: The system renders nodes using the `VisualNodeCard` component (Organism).
- FR4: The system renders connections between nodes using the `ConnectionLine` component (Molecule).
- FR5: The system automatically calculates node positions using a layout algorithm (e.g., Dagre/Elkjs) when the graph structure changes.
- FR6: The system virtualizes rendering to support large graphs (only visible nodes are rendered).

**AI Integration & Graph Generation**

- FR7: Users can submit a text prompt, document, or list of ideas to generate a graph.
- FR8: The `AI Connector` (Infrastructure) sends requests to an LLM (OpenAI/Claude) and parses the response into `NodeEntities` and connections.
- FR9: Users can send follow-up commands via a chat interface to modify the existing graph (e.g., "Remove this node", "Connect A to B").
- FR10: The system validates AI-generated connections against `NodeEntity` rules (e.g., "Filter node must have 1 input").

**Node Management**

- FR11: Users can select a node to view its details or focus the AI context on it.
- FR12: Users can manually edit the text content of a node (Title, Body).
- FR13: Users can delete a selected node (and its associated edges).
- FR14: The system supports multiple node types (e.g., Process, Decision, Note) defined in the Domain Layer.

**Application State & Persistence**

- FR15: The system maintains the Graph Model (nodes, edges) in a centralized store (Domain Layer).
- FR16: Users can save their current graph project locally or to the cloud (if backend exists).
- FR17: Users can clear the canvas to start a new project.

---

## Non-Functional Requirements

### Performance

- NFR1: Initial graph generation should complete within 15 seconds (dependent on LLM latency).
- NFR2: Canvas rendering should maintain 60fps during pan/zoom operations for graphs up to 500 nodes.
- NFR3: Layout recalculation should take less than 1 second for graphs under 100 nodes.

### Architecture & Maintainability

- NFR4: The codebase must strictly follow the 4-layer architecture (Presentation, Widget, Domain, Infrastructure).
- NFR5: UI components must adhere to Atomic Design principles (Atoms -> Molecules -> Organisms).
- NFR6: AI logic must be isolated in the Infrastructure layer to allow swapping providers (e.g., OpenAI to Claude) without affecting the Domain.

### Scalability

- NFR7: The internal data structure (Graph Model) must support efficient lookups (O(1) or O(log n)) for nodes and edges to support graph scaling.

---

_This PRD captures the essence of Canvas-AI-Logic - An interactive, AI-powered knowledge mapping tool built on Clean Architecture._

_Created through collaborative discovery between BMad and AI facilitator._
