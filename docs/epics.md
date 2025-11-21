# Canvas-AI-Logic - Epic Breakdown

**Author:** BMad
**Date:** 2025-05-15
**Project Level:** 1
**Target Scale:** MVP

---

## Overview

This document provides the complete epic and story breakdown for Canvas-AI-Logic, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This version incorporates context from UX Design and Architecture workflows.

**Epics Summary:**
1.  **Epic 1: Foundation & Project Setup**: Establishes the repo, build system, and core architectural layers.
2.  **Epic 2: AI Graph Generation**: Implements the core value proposition - generating graphs from text.
3.  **Epic 3: Interactive Canvas**: Enables visualization and manipulation of the graph.
4.  **Epic 4: Graph Refinement & Management**: Allows editing nodes and managing the graph state.
5.  **Epic 5: Technical Debt & Modernization**: Addresses security, testing, accessibility, and legacy dependencies.

---

## Functional Requirements Inventory

**Canvas & Visualization**
- FR1: Users can view an infinite 2D canvas that hosts nodes and edges.
- FR2: Users can pan the canvas (drag) and zoom in/out (scroll/buttons).
- FR3: The system renders nodes using the `VisualNodeCard` component (Organism).
- FR4: The system renders connections between nodes using the `ConnectionLine` component (Molecule).
- FR5: The system automatically calculates node positions using a layout algorithm (e.g., Dagre/Elkjs).
- FR6: The system virtualizes rendering to support large graphs.

**AI Integration & Graph Generation**
- FR7: Users can submit a text prompt, document, or list of ideas to generate a graph.
- FR8: The `AI Connector` (Infrastructure) sends requests to an LLM (OpenAI/Claude) and parses the response.
- FR9: Users can send follow-up commands via a chat interface to modify the existing graph.
- FR10: The system validates AI-generated connections against `NodeEntity` rules.

**Node Management**
- FR11: Users can select a node to view its details or focus the AI context on it.
- FR12: Users can manually edit the text content of a node (Title, Body).
- FR13: Users can delete a selected node.
- FR14: The system supports multiple node types (e.g., Process, Decision, Note).

**Application State & Persistence**
- FR15: The system maintains the Graph Model (nodes, edges) in a centralized store (Domain Layer).
- FR16: Users can save their current graph project locally.
- FR17: Users can clear the canvas to start a new project.

---

## FR Coverage Map

*   Epic 1: Foundation (FR15, FR16, FR17 partial)
*   Epic 2: AI Graph Generation (FR7, FR8, FR10, FR14)
*   Epic 3: Interactive Canvas (FR1, FR2, FR3, FR4, FR5, FR6)
*   Epic 4: Graph Refinement & Management (FR9, FR11, FR12, FR13, FR15, FR16, FR17)
*   Epic 5: Technical Debt (NFRs: Security, Maintainability, Accessibility)

---

## Epic 1: Foundation & Project Setup

**Goal:** Establish the project skeleton, configured with the 4-layer Clean Architecture, React/Vite build system, and basic domain state management.

### Story 1.1: Initialize Project Repository & Build System

As a Developer,
I want to set up the project repository with the correct build tools and structure,
So that the team has a consistent foundation for development.

**Acceptance Criteria:**

**Given** a fresh directory
**When** I run the setup commands
**Then** a React + TypeScript + Vite project is created
**And** the directory structure matches the 4-layer architecture (presentation, widget, domain, infrastructure) defined in `architecture.md`
**And** Tailwind CSS is configured
**And** Vitest is configured and running

**Prerequisites:** None
**Technical Notes:** Use `npm create vite@latest`. Set up strict TSConfig. Configure path aliases (e.g., `@domain/*`).

### Story 1.2: Implement Domain Layer Graph Model

As a Developer,
I want to define the core Node and Edge entities and the Graph Store,
So that the application can maintain state.

**Acceptance Criteria:**

**Given** the domain layer
**When** I define `NodeEntity`, `EdgeEntity` interfaces
**And** I implement the `GraphStore` using Zustand
**Then** I can programmatically add, remove, and update nodes in the store
**And** the state is typed correctly according to `architecture.md`

**Prerequisites:** 1.1
**Technical Notes:** Define Zod schemas for validation if needed. Ensure store actions are pure functions where possible.

---

## Epic 2: AI Graph Generation

**Goal:** Implement the "AI Connector" infrastructure and the user flow for generating a graph from text input.

### Story 2.1: Implement AI Connector & Prompt Engineering

As a Developer,
I want to create the service that talks to OpenAI/Claude,
So that I can transform text into structured JSON.

**Acceptance Criteria:**

**Given** an OpenAI API key
**When** I call `generateGraph(prompt)` with a text description
**Then** I receive a validated JSON object containing nodes and edges
**And** the JSON structure matches the Domain Graph Model
**And** errors (API failure, malformed JSON) are handled gracefully

**Prerequisites:** 1.2
**Technical Notes:** Create a prompt template that enforces the JSON schema. Use `zod` to parse the LLM response.

### Story 2.2: Create "Brain Dump" Input UI

As a User,
I want a simple input interface to type my initial ideas,
So that I can start the generation process.

**Acceptance Criteria:**

**Given** the empty state of the application
**When** I see the landing screen
**Then** I see a large text area and a "Generate" button
**And** entering text and clicking Generate triggers the `AIConnector`
**And** a loading state is shown during generation

**Prerequisites:** 2.1, 1.1
**Technical Notes:** This is the "Journey 1" entry point from UX Design.

---

## Epic 3: Interactive Canvas

**Goal:** Visualize the generated graph using the Widget Layer and Presentation Layer components.

### Story 3.1: Implement VisualNodeCard Component

As a User,
I want to see nodes rendered as beautiful cards,
So that I can read the content clearly.

**Acceptance Criteria:**

**Given** a `NodeEntity`
**When** the system renders it
**Then** it displays the Title and Body
**And** it uses the "VisualNodeCard" organism styling (white card, shadow, rounded corners) defined in UX Design
**And** it shows correct semantic colors based on node type

**Prerequisites:** 1.1
**Technical Notes:** Use Tailwind for styling. Ensure accessibility (screen reader labels).

### Story 3.2: Implement Canvas Widget with Auto-Layout

As a User,
I want the nodes to be arranged automatically on a 2D canvas,
So that the graph is readable without me moving things manually.

**Acceptance Criteria:**

**Given** a set of nodes and edges in the store
**When** the graph is updated
**Then** the `Elkjs` (or Dagre) layout engine calculates positions
**And** the Canvas Widget renders the nodes at those positions
**And** I can pan and zoom the canvas

**Prerequisites:** 3.1, 1.2
**Technical Notes:** Integrate `react-zoom-pan-pinch` or build custom canvas logic. Wrap Elkjs in a Web Worker if possible.

### Story 3.3: Render Connections

As a User,
I want to see lines connecting the nodes,
So that I understand the relationships.

**Acceptance Criteria:**

**Given** an `EdgeEntity`
**When** the canvas renders
**Then** an SVG line is drawn between the source and target node ports
**And** the line updates position when the canvas is panned/zoomed

**Prerequisites:** 3.2
**Technical Notes:** Use SVG overlay on the canvas.

---

## Epic 4: Graph Refinement & Management

**Goal:** Allow users to interact with the graph, edit nodes, and use the Chat Interface for refinements.

### Story 4.1: Implement Chat Interface for Refinement

As a User,
I want a sidebar chat interface,
So that I can ask the AI to modify the graph.

**Acceptance Criteria:**

**Given** a populated graph
**When** I open the Chat Sidebar and type "Add a step here"
**Then** the message is sent to the `AIConnector` with the current graph context
**And** the `AIConnector` returns a "Graph Diff" or new Graph
**And** the local graph updates to reflect changes

**Prerequisites:** 2.1, 3.2
**Technical Notes:** Needs a new `refineGraph` method in AIConnector.

### Story 4.2: Manual Node Editing

As a User,
I want to double-click a node to edit its text,
So that I can fix typos or change details manually.

**Acceptance Criteria:**

**Given** a rendered node
**When** I double-click it
**Then** it enters "Edit Mode" (input field replaces text)
**And** saving updates the Domain Store
**And** the layout remains stable (or slight adjustment if size changes)

**Prerequisites:** 3.1
**Technical Notes:** Direct manipulation pattern.

---

## Epic 5: Technical Debt & Modernization

**Goal:** Bring the codebase up to modern standards (2025), fix broken features, and ensure long-term maintainability.

### Story 5.1: Fix PNG Export Functionality

As a User,
I want to download my graph as a PNG image,
So that I can share it with others.

**Acceptance Criteria:**

**Given** a populated graph
**When** I click the "Download PNG" button
**Then** the browser downloads a `.png` file of the current view
**And** the image is not blank
**And** no error alert is shown

**Prerequisites:** Epic 3
**Technical Notes:** Fixes the `react-zoom-pan-pinch` class selector bug in `ChatSidebar`.

### Story 5.2: Modernize Build System (Vite + ESLint)

As a Developer,
I want to use the latest build and linting tools,
So that the project is secure and follows current best practices.

**Acceptance Criteria:**

**Given** the codebase
**When** I run `npm install` and `npm run dev`
**Then** I see no deprecation warnings from `vite` or `eslint`
**And** the configuration files use the new formats (`eslint.config.js`)

**Prerequisites:** None
**Technical Notes:** Upgrade Vite to v6, ESLint to v9.

### Story 5.3: Accessibility Improvements

As a User with disabilities,
I want to navigate the nodes using my keyboard,
So that I can use the application without a mouse.

**Acceptance Criteria:**

**Given** the canvas
**When** I press Tab
**Then** focus moves between nodes
**And** I can press Enter to edit a node

**Prerequisites:** 3.1
**Technical Notes:** Add `role="button"` and `tabIndex` to VisualNodeCard.

### Story 5.4: Add End-to-End Testing

As a Developer,
I want to run automated E2E tests,
So that I can verify critical user flows before releasing.

**Acceptance Criteria:**

**Given** the CI pipeline
**When** code is pushed
**Then** Playwright tests run for "Generate Graph" and "Export PNG"
**And** tests pass

**Prerequisites:** None
**Technical Notes:** Install Playwright.
