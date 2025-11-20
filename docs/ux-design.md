# Canvas-AI-Logic UX Design Specification

_Created on 2025-05-15 by BMad_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Project Vision:** The Interactive AI Canvas is a web-based knowledge management tool that transforms unstructured text, documents, and ideas into structured, visual knowledge graphs. It leverages AI to automatically generate nodes and connections, organizing them into a logical layout. The system empowers users to interactively refine these graphs through natural language dialogue, bridging the gap between "messy thoughts" and "structured diagrams."

**Users:** Knowledge Workers, Researchers, System Architects, Developers, and Product Managers who need to organize complex information.

**Core Experience:** Effortless generation of visual graphs from text, followed by intuitive chat-based refinement.

**Desired Feeling:** Empowered and In Control. Users should feel that the AI is a capable partner that handles the drudgery of drawing, allowing them to focus on the structure and content.

**Platform:** Web Application (Desktop-first for complex graphs, mobile-responsive for viewing).

---

## 1. Design System Foundation

### 1.1 Design System Choice

**System:** **Radix UI** (Primitives) + **Tailwind CSS** (Styling)
**Rationale:** This combination offers the best balance of accessibility (via Radix) and customizability (via Tailwind). Since the application has a unique "Canvas" interface that doesn't map neatly to standard "Dashboard" templates like Ant Design or Material UI, the unstyled primitives of Radix allow for creating a bespoke look and feel that matches the "Clean Architecture" and "Atomic Design" principles of the project.
**Provides:** Accessible modals, dropdowns, tooltips, popovers, and dialogs.
**Customization:** High. We will build our own "Atomic" component library on top of these primitives.

---

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience is **"The Living Canvas"**.
1.  **Input:** User types a thought.
2.  **Transformation:** The system instantly visualizes it.
3.  **Conversation:** User talks to the graph to change it.

It is NOT a drawing tool (like Miro/Figma) where you drag and drop boxes manually. It is a *generative* tool where you describe structure, and the system draws it.

### 2.2 Novel UX Patterns

**Chat-to-Graph Mutation:**
*   **User Goal:** Modify the graph structure without manual drawing.
*   **Trigger:** User selects a node and types a command (e.g., "Break this down into 3 steps").
*   **Feedback:** The graph animates (nodes shift, new nodes appear) to reflect the change.
*   **Visual Feedback:** New nodes might "pop" in or fade in; existing nodes slide to make room.

---

## 3. Visual Foundation

### 3.1 Color System

**Theme:** **"Cognitive Clarity"**
*   **Primary:** Deep Indigo (`#4F46E5`) - Represents intelligence and structure.
*   **Secondary:** Teal (`#14B8A6`) - Represents growth and connection.
*   **Canvas Background:** Off-white / Dot grid (`#F8FAFC`) - Reduces eye strain, feels like paper.
*   **Nodes:** White cards with subtle shadows (`#FFFFFF`).
*   **Semantic Colors:**
    *   Success: Emerald
    *   Warning: Amber
    *   Error: Rose
    *   Neutral: Slate

**Typography:**
*   **Headings:** Inter (Clean, modern sans-serif, high legibility).
*   **Body:** Inter.
*   **Monospace:** JetBrains Mono (for code snippets or technical data within nodes).

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Direction:** **"Focused Minimalist"**
*   **Layout:**
    *   **Canvas:** Takes up 100% of the viewport.
    *   **Controls:** Floating toolbars (bottom center for zoom/pan, top left for file actions).
    *   **Chat/AI Sidebar:** Collapsible right panel. It shouldn't obscure the graph unless actively used.
*   **Hierarchy:** The Graph is King. UI elements are semi-transparent or minimal to avoid distraction.
*   **Interaction:** Direct manipulation (click to select, drag to pan) combined with command-based mutation.

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**Journey 1: The "Brain Dump" to Graph**
1.  **Entry:** User lands on an empty canvas with a prominent central input box ("What do you want to map?").
2.  **Input:** User pastes a paragraph of text or types a bulleted list.
3.  **Processing:** A subtle loading animation (not blocking) indicates AI processing.
4.  **Success:** The graph blooms onto the canvas. The layout stabilizes.
5.  **Refinement:** User clicks a node -> Sidebar opens -> User types "Add more detail" -> Graph updates.

**Journey 2: Manual Refinement**
1.  **Entry:** User views an existing graph.
2.  **Action:** User double-clicks a node text.
3.  **Edit:** Text becomes editable (inline input).
4.  **Save:** User presses Enter or clicks outside. Graph node updates.

---

## 6. Component Library

### 6.1 Component Strategy

**Atoms (UI-Kit):**
*   `Button`: Primary (Indigo), Secondary (Ghost), Icon-only.
*   `Input`: Minimal border, focus ring.
*   `NodeShape`: The base container for a node (rounded rect, border, shadow).
*   `Port`: Small circles on node edges for connections.

**Molecules:**
*   `NodeHeader`: Icon + Title + Action Menu (three dots).
*   `Toolbar`: A floating pill containing Zoom In, Zoom Out, Fit to Screen.
*   `ChatMessage`: Bubble containing user or AI text.

**Organisms:**
*   `VisualNodeCard`: The composition of NodeShape, NodeHeader, Body, and Ports.
*   `ChatPanel`: The full sidebar with message history and input area.

**Templates:**
*   `CanvasLayout`: The full-screen container managing the Z-index of the canvas, toolbar, and sidebar.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

*   **Selection:**
    *   Single click: Selects node (highlight border).
    *   Click background: Deselects.
    *   Drag background: Pans canvas.
*   **Zoom:**
    *   Scroll wheel: Zooms in/out.
    *   Pinch: Zooms in/out.
*   **Feedback:**
    *   **Loading:** Indeterminate progress bar at the top of the Chat Panel during AI generation.
    *   **Success:** Toast notification "Graph updated".
    *   **Error:** Toast notification "Failed to generate. Try again."
*   **Animations:**
    *   Node layout changes should ALWAYS be animated (using a library like `framer-motion` or CSS transitions) to help users maintain their mental map. Teleporting nodes is disorienting.

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

*   **Desktop (Primary):** Full capability. Sidebar can be pinned open.
*   **Tablet:** Sidebar overlays the canvas when open. Touch gestures for pan/zoom.
*   **Mobile:**
    *   **View Mode:** Optimized for viewing. Pinch to zoom.
    *   **Edit Mode:** Limited. The chat interface takes up the full screen when active.
    *   **Complex actions:** "Best experience on Desktop" warning if the graph is too large.

**Accessibility (Target: WCAG AA):**
*   **Keyboard Nav:** Users can tab through nodes. Enter to select. Arrow keys to navigate between connected nodes.
*   **Screen Readers:** Nodes should announce their title and connection count ("Topic Node, 3 connections").
*   **Contrast:** Ensure node text satisfies 4.5:1 contrast ratio.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

This specification defines a clean, modern, and highly interactive tool. The implementation should focus heavily on the **Widget Layer** (Canvas responsiveness and virtualization) and the **Presentation Layer** (faithful execution of the "Cognitive Clarity" theme).

**Key Technical Challenges to solve early:**
1.  **Virtualization:** Ensure the canvas remains smooth with 500+ nodes.
2.  **Layout Animation:** Smoothly interpolating between Dagre/Elkjs layout states.

---
