# Internal Diagnosis Report

## 1. Intended Purpose (as inferred from the repo)
The project is an **"Interactive AI Canvas"** designed to facilitate the visualization of ideas. Its core purpose is to transform unstructured user input (text) into structured knowledge graphs (nodes and edges) using AI. The intended workflow enables users to:
*   **Generate** an initial graph from a "brain dump" or topic prompt.
*   **Refine** the graph conversationally via a Chat Assistant (adding/removing/modifying nodes).
*   **Edit** nodes manually (content and titles).
*   **Export** the visual result as a portable artifact (JSON or PNG).
*   The architecture is designed for scalability (Clean Architecture) and team-based workflows (implied by BMad context), though the current state is a single-user MVP.

## 2. Implemented Functionality (what exists today)
*   **Architecture:** A strict **Clean Architecture** implementation (Presentation, Widget, Domain, Infrastructure layers) with **Dependency Injection** (`src/di.ts`) handling the wiring.
*   **Tech Stack:** Modernized Environment using **React 19**, **Tailwind CSS v4**, and **Vite** (notably configured as `^7.2.4` in `package.json`, which appears to be a forward-looking or erroneous version).
*   **State Management:** Global state handled by **Zustand**, persisting data to `localStorage` (`canvas-ai-storage`).
*   **AI Integration:**
    *   `GeminiConnector`: Implements 'CHAT', 'REFINE', and 'CREATE' intent classification.
    *   `MockAIConnector`: A fallback for development that generates a static "Sales Funnel" graph when API keys are missing.
*   **Graph & Layout:**
    *   `GraphModel`: Stores nodes and edges as normalized records.
    *   `ElkAdapter`: Uses `elkjs` for automatic layered graph layout.
    *   `CanvasWidget`: A custom implementation for rendering, panning, and zooming.
*   **User Interface:**
    *   `PromptInput`: For initial graph generation.
    *   `ChatSidebar`: For conversational refinement and export actions.
    *   `VisualNodeCard`: fully accessible node components (`role="button"`, keyboard support).
*   **Export:**
    *   JSON: Downloads the raw graph state.
    *   PNG: Uses `html-to-image` to capture the canvas.

## 3. Gaps and Inconsistencies
*   **Process Documentation:** `AGENTS.md` explicitly requires agents to log decisions in `docs/DECISIONS.md`, but **this file does not exist**.
*   **Canvas Boundaries:** The application simulates an infinite canvas but actually relies on a **hardcoded 5000px x 5000px SVG overlay**. This places a rigid limit on the graph size and affects export behavior.
*   **Mobile/Touch Support:** The `CanvasWidget` implements `onMouseDown`/`onMouseMove` handlers but lacks corresponding `onTouch` events, rendering the pan/zoom functionality unusable on touch devices.
*   **Layout Threading:** The `ElkAdapter` runs layout calculations on the **main thread**. The architecture documentation suggests using Web Workers for performance, but this has not been implemented.

## 4. Likely Failure Points
*   **Export Usability:** The PNG export targets `canvas-export-root`, which contains the fixed `5000px` SVG. This means **every exported PNG will likely be 25 megapixels (5000x5000)**, resulting in files dominated by whitespace for small graphs or clipping for graphs exceeding 5000px.
*   **State Corruption:** The application persists state to `localStorage` but implements **no schema migration strategy**. As noted in `troubleshooting.md`, any change to the `NodeEntity` structure will cause the app to crash (White Screen) for returning users until they manually clear their storage.
*   **AI Parsing Fragility:** The `GeminiConnector` parses graph updates by using a simple regex (`replace(/```json/g, '')`). If the AI becomes "chatty" or formats the JSON poorly (common with smaller models or edge cases), the parsing will fail and the user's request will likely be ignored or error out.

## 5. Areas of Uncertainty (what cannot be confidently determined)
*   **Large Graph Performance:** It is uncertain how the application performs with 100+ nodes. The combination of DOM-based rendering (`VisualNodeCard`s are HTML `div`s, not Canvas primitives) and main-thread layout calculations suggests potential framerate drops that are currently unmeasured.
*   **Vite Version:** The `package.json` specifies `vite: "^7.2.4"`. Since Vite 6 is the current stable major version, this is either a typo or a custom/beta build, which introduces uncertainty regarding build stability.

## 6. Diagnostic Summary
The project is a technologically modern MVP that successfully implements its core user flows (Input -> AI -> Graph -> Export). It adheres to a robust Clean Architecture that separates concerns well. However, the application currently suffers from "prototype fragility":
1.  **Rigid Constraints:** The hardcoded canvas size is a significant limitation for a "knowledge graph" tool.
2.  **Brittle Data:** The lack of migration logic makes persistent state risky during active development.
3.  **UX Edge Cases:** Export outputs are unwieldy, and mobile support is effectively absent.

While functionally complete per the "Definition of Done" for the initial Epics, the codebase requires hardening (specifically regarding Canvas implementation and Data persistence) before it can be considered robust.
