# Story 4-4: Export Graph

**Epic:** 4 - Graph Refinement & Management
**Story Owner:** Developer
**Estimate:** 2
**Status:** Ready for Development

## 1. Description
As a User,
I want to export my graph as an image or JSON file,
So that I can share it or use it in other tools.

## 2. Acceptance Criteria
- [ ] **UI:** An "Export" button is available (e.g., in the Chat Sidebar or new Toolbar).
- [ ] **Functionality:** Clicking export offers options: "Download JSON" and "Download PNG".
- [ ] **JSON Export:** Downloads the current `GraphModel` as a `.json` file.
- [ ] **PNG Export:** Downloads the rendered canvas as a `.png` file.

## 3. Technical Plan
- **Dependencies:** Install `html-to-image` for PNG generation.
- **UI:** Add export buttons to `ChatSidebar` (or create a `Toolbar` organism).
- **Logic:**
    - JSON: `Blob` + `URL.createObjectURL`.
    - PNG: `toPng(document.getElementById('canvas-root'))`.

## 4. Test Plan
- **Manual:** Verify files are downloaded and valid.
