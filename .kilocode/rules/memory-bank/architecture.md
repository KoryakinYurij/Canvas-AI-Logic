# Canvas-AI-Logic Architecture

## System Architecture
The project implements a multi-layer architecture inspired by Clean Architecture and Atomic Design principles, enabling independent scaling and modular development.

## Four-Layer Architecture

### Layer 1: Presentation Layer (UI-Kit/Components)
**Location:** `src/components/`
**Purpose:** Pure rendering logic with maximum dumbness
**Structure:**
- **Atoms:** Basic UI elements (buttons, icons, geometric shapes)
- **Molecules:** Composite components (NodeHeader, PortSocket, ConnectionLine)  
- **Organisms:** Complete visual entities (VisualNodeCard)

**Key Files:**
- `src/components/atoms/` - Basic UI primitives
- `src/components/molecules/` - Composite UI elements
- `src/components/organisms/` - Complete visual components

### Layer 2: Widget Layer (Smart Components)
**Location:** `src/widgets/`
**Purpose:** Connect UI with user actions and state management
**Components:**
- **NodeContainer:** Smart wrapper for node rendering with state integration
- **CanvasWidget:** Manages zoom, pan, and virtualization
- **AutoLayoutService:** Algorithms for graph positioning (Dagre, Elkjs)

**Key Files:**
- `src/widgets/NodeContainer.tsx`
- `src/widgets/CanvasWidget.tsx`
- `src/widgets/layout/` - Layout algorithms

### Layer 3: Domain Layer (Business Logic)
**Location:** `src/domain/`
**Purpose:** Core business rules and entity definitions
**Entities:**
- **Node Entities:** Classes defining node types and connection rules
- **Graph Model:** Single source of truth `{ nodes: [], edges: [] }`
- **Business Rules:** Validation and transformation logic

**Key Files:**
- `src/domain/entities/` - Node and Graph entities
- `src/domain/services/` - Business logic services
- `src/domain/types/` - Type definitions

### Layer 4: Infrastructure Layer (External Integration)
**Location:** `src/infrastructure/`
**Purpose:** External service connections and data transformation
**Components:**
- **AI Connector:** Integration with AI services (OpenAI, Claude)
- **Data Mappers:** Transform AI responses to domain entities
- **API Clients:** External service interfaces

**Key Files:**
- `src/infrastructure/ai/` - AI service integrations
- `src/infrastructure/mappers/` - Data transformation
- `src/infrastructure/clients/` - External API clients

## Data Flow Architecture
1. **User Input** → Presentation Layer
2. **AI Processing** → Infrastructure Layer
3. **Domain Mapping** → Domain Layer
4. **Layout Calculation** → Widget Layer
5. **Rendering** → Presentation Layer

## Component Relationships
- **Presentation Layer** receives data from Widget Layer
- **Widget Layer** manages Domain Layer entities
- **Domain Layer** defines business rules and validation
- **Infrastructure Layer** provides data to Domain Layer

## Key Design Patterns
- **Clean Architecture:** Clear separation between layers
- **Atomic Design:** Hierarchical component organization
- **Dependency Inversion:** Higher layers don't depend on lower layers
- **Single Source of Truth:** Graph model as unified data structure