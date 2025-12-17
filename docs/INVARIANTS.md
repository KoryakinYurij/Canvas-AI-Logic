# Project Invariants

The following invariants **MUST NOT** be broken. If an agent is unsure whether a change violates an invariant, it **MUST** stop and ask for clarification.

## 1. Architectural Layering
*   **Strict Separation:** The application must adhere to the 4-layer Clean Architecture:
    *   **Presentation Layer:** UI components (Atoms, Molecules, Organisms).
    *   **Widget Layer:** Smart components and Layout Engines.
    *   **Domain Layer:** Business logic, Entities, Use Cases.
    *   **Infrastructure Layer:** External world adapters (AI, Storage).
*   **Dependency Rule:** Dependencies must point **inwards** (towards Domain). Presentation/Infrastructure depend on Domain. Domain does not depend on anything outer.

## 2. Public API Stability
*   Existing public APIs (e.g., Use Case signatures, Entity structures used by persistence) must not be changed without an explicit decision record in `docs/DECISIONS.md`.

## 3. Test Stability
*   **Determinism:** Tests must be deterministic. Flaky tests are considered broken.
*   **Coverage:** New behavior must be covered by tests or explicitly justified.

## 4. Anti-Slop
*   Do not introduce unused abstractions.
*   Do not add features without a clear requirement.
*   Prefer small, explicit, reviewable changes.
