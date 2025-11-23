# Story 5.1: Fix PNG Export Functionality

**Epic:** 5 - Technical Debt & Modernization
**Status:** ready-for-dev
**Estimate:** 1h

---

## Context
The "Export PNG" feature in the Chat Sidebar is currently broken. It attempts to locate the canvas element using a CSS class selector (`.react-transform-component`) that belongs to a library (`react-zoom-pan-pinch`) which was removed from the implementation of the `CanvasWidget`.

## Technical Changes
1.  **Update `CanvasWidget.tsx`**:
    -   Wrap the content that should be exported (the nodes and edges container) in a `div` or `div` reference.
    -   Assign a stable `id` (e.g., `canvas-export-root`) to this wrapper.
2.  **Update `ChatSidebar.tsx`**:
    -   Change the element selection logic in `handleExportPNG` from `querySelector` to `getElementById('canvas-export-root')`.
    -   Ensure the background color is explicitly set (white) during export, as transparent backgrounds can look broken.

## Acceptance Criteria
- [ ] Clicking the "Download" button in the sidebar downloads a PNG file.
- [ ] The PNG file contains the visual representation of the nodes and edges.
- [ ] No error alert "Could not find canvas element" is shown.
