# Architecture

## Executive Summary

The Canvas-AI-Logic system is built on a strict 4-layer Clean Architecture (Presentation, Widget, Domain, Infrastructure) to ensure scalability, testability, and separation of concerns. It leverages React for the frontend, utilizing Atomic Design principles for UI components. The core logic revolves around a JSON-based Graph Model, manipulated by a Domain Layer and visualized via a custom Widget Layer that wraps layout engines like Dagre/Elkjs. AI integration is isolated in the Infrastructure Layer to allow for easy swapping of LLM providers.

## Project Initialization

First implementation story should execute:
```bash
npm create vite@latest canvas-ai-logic -- --template react-ts
```

This establishes the base architecture with these decisions:
- React + TypeScript
- Vite as build tool
- ESLint for linting

## Decision Summary

| Category | Decision | Version | Affects | Rationale |
| -------- | -------- | ------- | ------- | --------- |
| Frontend Framework | React | 18.x | All UI | Component-based, vast ecosystem, fits Atomic Design. |
| Language | TypeScript | 5.x | All | Type safety for complex graph models. |
| Build Tool | Vite | Latest | DevExp | Fast HMR, modern standard. |
| State Management | Zustand | Latest | Domain | Lightweight, simpler than Redux for local graph state. |
| Styling | Tailwind CSS | Latest | Presentation | Utility-first, pairs well with Atomic Design. |
| UI Primitives | Radix UI | Latest | Presentation | Accessible, unstyled base for custom components. |
| Layout Engine | Elkjs | Latest | Widget | Powerful automatic layout for complex graphs. |
| Graph Rendering | Custom (SVG/HTML) | N/A | Widget | Full control over node styling (vs libraries like React Flow which might limit custom "HTML-in-node"). |
| AI Client | OpenAI SDK | Latest | Infrastructure | Standard library for connecting to LLMs. |
| Testing | Vitest + React Testing Library | Latest | Testing | Fast, compatible with Vite. |
| E2E Testing | Playwright | Latest | Testing | Reliable full-flow testing. |

## Project Structure

```
canvas-ai-logic/
├── src/
│   ├── presentation/          # Layer 1: UI Components (Atomic Design)
│   │   ├── atoms/             # Buttons, Inputs, Shapes
│   │   ├── molecules/         # NodeHeaders, SearchBars
│   │   ├── organisms/         # VisualNodeCard, ChatPanel
│   │   └── templates/         # CanvasLayout
│   ├── widget/                # Layer 2: Smart Components & Layout
│   │   ├── containers/        # NodeContainer (connects Entity to Visual)
│   │   ├── canvas/            # CanvasWidget (Zoom/Pan logic)
│   │   └── layout/            # LayoutEngine adapters (Elkjs)
│   ├── domain/                # Layer 3: Business Logic
│   │   ├── entities/          # NodeEntity, EdgeEntity
│   │   ├── graph/             # GraphModel, GraphStore (Zustand)
│   │   └── usecases/          # "AddNode", "AutoLayout", "ProcessAICommand"
│   ├── infrastructure/        # Layer 4: External World
│   │   ├── ai/                # AIConnector, PromptTemplates
│   │   └── persistence/       # LocalStorageAdapter
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── domain/
│   ├── widget/
│   └── e2e/
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Epic to Architecture Mapping

| Epic | Architecture Components |
| --- | --- |
| **Core Canvas** | `widget/canvas/CanvasWidget`, `domain/graph/GraphStore` |
| **AI Generation** | `infrastructure/ai/AIConnector`, `domain/usecases/ProcessAICommand` |
| **Node Visualization** | `presentation/organisms/VisualNodeCard`, `widget/containers/NodeContainer` |
| **Manual Editing** | `domain/usecases/UpdateNode`, `presentation/molecules/NodeHeader` |
| **Layout Engine** | `widget/layout/ElkAdapter`, `domain/usecases/AutoLayout` |

## Technology Stack Details

### Core Technologies
*   **React 18**: Functional components, Hooks.
*   **TypeScript**: Strict mode enabled.
*   **Zustand**: For global graph state `useGraphStore`.
*   **Elkjs**: For calculating graph layouts.
*   **OpenAI API**: For generating graph structures.

### Integration Points
*   **AI Integration**: `AIConnector` sends prompts -> receives JSON -> `GraphModel` updates.
*   **Layout Integration**: `GraphModel` changes -> triggers `AutoLayout` -> updates `NodeEntity` coordinates -> `CanvasWidget` re-renders.

## Novel Pattern Designs

### Pattern: "The Living Graph" (AI-Driven Mutation)
*   **Challenge**: Synchronizing AI generation with local user edits without race conditions.
*   **Solution**: A "Command Queue" in the Domain Layer.
    *   User edits are instant synchronous commands.
    *   AI requests are asynchronous commands.
    *   State updates flow unidirectionally: Command -> Reducer -> New State -> Layout Recalculation -> Render.
*   **Components**: `CommandDispatcher`, `GraphReducer`.

## Implementation Patterns

### Naming Conventions
*   **Components**: PascalCase (e.g., `VisualNodeCard.tsx`).
*   **Hooks**: camelCase (e.g., `useGraphStore.ts`).
*   **Entities**: PascalCase (e.g., `NodeEntity.ts`).
*   **Interfaces**: PascalCase, no "I" prefix (e.g., `Node`, not `INode`).
*   **Stores**: `use[Name]Store` (e.g., `useGraphStore`).

### Code Organization
*   **Barrel Exports**: Use `index.ts` in folders to expose public API of a layer.
*   **Colocation**: CSS/Test files sit next to the component (e.g., `Button.tsx`, `Button.test.tsx`).

### Error Handling
*   **UI Errors**: Error Boundaries wrap major widgets (`CanvasWidget`).
*   **AI Errors**: `AIConnector` catches API failures and returns a `Result<Graph, Error>` type. The UI displays a toast notification.

### Logging Strategy
*   **Dev**: Console logging with structured prefixes `[Domain]`, `[AI]`.
*   **Prod**: Minimal logging, potential Sentry integration later.

## Data Architecture

### Graph Model
```typescript
interface GraphModel {
  nodes: Record<string, NodeEntity>;
  edges: Record<string, EdgeEntity>;
  metadata: {
    version: string;
    created: Date;
  };
}

interface NodeEntity {
  id: string;
  type: 'topic' | 'action' | 'note';
  data: {
    title: string;
    body?: string;
  };
  position: { x: number; y: number }; // Calculated by Layout Engine
  dimensions: { width: number; height: number };
}

interface EdgeEntity {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}
```

## API Contracts

### AI Connector Interface
```typescript
interface AIConnector {
  generateGraph(prompt: string): Promise<PartialGraph>;
  refineGraph(currentGraph: GraphModel, command: string): Promise<GraphDiff>;
}
```

## Security Architecture
*   **API Keys**: OpenAI keys stored in environment variables (`.env`). Never committed.
*   **Input Sanitization**: All user and AI text sanitized before rendering to prevent XSS.

## Performance Considerations
*   **Virtualization**: `CanvasWidget` must implement windowing to only render nodes in the viewport.
*   **Memoization**: `VisualNodeCard` must be wrapped in `React.memo` to prevent re-renders during panning.
*   **Web Workers**: Layout calculations (Elkjs) should run in a Web Worker to avoid freezing the main thread.

## Deployment Architecture
*   **Vercel/Netlify**: Static site hosting.
*   **CI/CD**: GitHub Actions running `vitest` and `tsc` on push.

## Development Environment

### Prerequisites
*   Node.js 18+
*   npm 9+

### Setup Commands
```bash
npm install
npm run dev
```

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-05-15_
_For: BMad_
