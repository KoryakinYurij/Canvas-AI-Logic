# Story 4-2: Manual Node Editing

**Epic:** 4 - Graph Refinement & Management
**Story Owner:** Developer
**Estimate:** 2
**Status:** Ready for Development

## 1. Description
As a User,
I want to double-click a node to edit its text,
So that I can fix typos or change details manually.

The user needs a direct manipulation method to correct or update the content of specific nodes without going through the AI chat.

## 2. Acceptance Criteria
- [ ] **Interaction:** Double-clicking a `VisualNodeCard` switches it to "Edit Mode".
- [ ] **UI - Edit Mode:** The Title and Body text are replaced by input/textarea fields.
- [ ] **Actions:**
    - "Save" (or Enter/Blur) commits the changes to the store.
    - "Cancel" (Esc) reverts to the original text.
- [ ] **Logic:** The `GraphStore` is updated with the new data.
- [ ] **Layout:** The node card expands if the new text is longer, and the graph layout adapts (or remains stable if possible).

## 3. Technical Plan

### 3.1 Domain Layer
- **Update `GraphStore`:** Ensure `updateNode(id, data)` action exists and is working.

### 3.2 Presentation Layer
- **Modify `VisualNodeCard.tsx`:**
    - Add local state `isEditing`, `editTitle`, `editBody`.
    - Add event handler for `onDoubleClick`.
    - Render inputs when `isEditing` is true.
    - Handle Save/Cancel logic.

## 4. Test Plan
- **Unit Test:** Test `VisualNodeCard` enters edit mode and calls `updateNode` on save.
- **Manual Verify:** Double click node, change text, reload (if persistence implemented later) or check state.
