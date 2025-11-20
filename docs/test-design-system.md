# System-Level Test Design

**Date:** 2025-05-15
**Author:** BMad
**Status:** Approved

---

## Executive Summary

This document outlines the system-level test strategy for the Canvas-AI-Logic project. Given the "Interactive AI Canvas" nature, testing must focus heavily on the correctness of the Graph Model (Domain Layer), the visual stability of the Canvas (Widget Layer), and the reliability of the AI integration (Infrastructure Layer).

---

## Testability Assessment

- **Controllability:** PASS. The Clean Architecture ensures the Domain Layer is pure and testable without UI. The AI Connector is isolated, allowing for easy mocking of LLM responses.
- **Observability:** PASS. The GraphStore (Zustand) provides a transparent state container. Layout positions are part of the entity state, making them verifiable.
- **Reliability:** PASS. Domain logic is deterministic. AI non-determinism is handled by mocking.

## Architecturally Significant Requirements (ASRs)

| Requirement | Category | Risk Score (Prob x Imp) | Test Strategy |
| --- | --- | --- | --- |
| **Graph Consistency** | Data Integrity | 3 (Possible) x 3 (Critical) = **9** | Extensive Unit Tests for `GraphStore` reducers to ensure node/edge validity. |
| **AI Output Validity** | Reliability | 3 (Likely) x 2 (Degraded) = **6** | Integration tests for `AIConnector` with schema validation (Zod). |
| **Canvas Performance** | Performance | 2 (Possible) x 2 (Degraded) = **4** | Performance tests (60fps check) with large graph mocks (500+ nodes). |
| **Layout Stability** | Usability | 2 (Possible) x 2 (Degraded) = **4** | Visual Regression Tests (Playwright) to ensure layout doesn't "jump" unexpectedly. |

## Test Levels Strategy

### Unit Testing (60%)
*   **Focus:** Domain Layer (Entities, Use Cases, Store Logic) and Utility functions.
*   **Tools:** Vitest.
*   **Rationale:** Fast feedback loops for the complex graph manipulation logic are essential.

### Component Testing (20%)
*   **Focus:** Widget Layer (`NodeContainer`, `CanvasWidget`) and Presentation Layer (`VisualNodeCard`).
*   **Tools:** React Testing Library + Vitest.
*   **Rationale:** Verify that components render the graph state correctly without needing a full browser environment.

### E2E Testing (20%)
*   **Focus:** Critical User Journeys (Text-to-Graph, Manual Refinement).
*   **Tools:** Playwright.
*   **Rationale:** Ensures the full flow (UI -> Domain -> Infrastructure -> AI -> Domain -> UI) works together.

## NFR Testing Approach

- **Security:**
    - **Tests:** Verify input sanitization prevents XSS in node bodies.
    - **Tools:** Unit tests with malicious payloads.
- **Performance:**
    - **Tests:** Measure time-to-interactive for 500-node graphs.
    - **Tools:** Playwright trace analysis.
- **Reliability:**
    - **Tests:** Verify graceful error handling when AI API fails.
    - **Tools:** Mock API failures in E2E tests.

## Test Environment Requirements

- **Local:** `vitest` for unit/component tests.
- **CI:** GitHub Actions running all tests on PR.
- **E2E:** Headless Chrome in CI.

## Recommendations for Sprint 0

1.  Set up Vitest and React Testing Library configuration in `vite.config.ts`.
2.  Install Playwright and configure `playwright.config.ts`.
3.  Create a `MockAIConnector` to facilitate offline development and testing.
4.  Establish a "Test Data Factory" to easily generate complex graph structures for performance testing.
