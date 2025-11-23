# Story 5.3: Accessibility Improvements

**Epic:** 5 - Technical Debt & Modernization
**Status:** ready-for-dev
**Estimate:** 1h

---

## Context
The `VisualNodeCard` component is currently implemented as a `div` with `onClick` handlers. This makes it inaccessible to keyboard users and screen readers. We need to make the nodes focusable and actionable using standard keyboard interactions.

References: `docs/technical-debt-report.md`

## Technical Changes

### VisualNodeCard.tsx
1.  **Semantics**: Change the outer `div` to have `role="button"` (or use a `<button>` element if styling allows easily).
2.  **Focus**: Add `tabIndex={0}` to make the node focusable.
3.  **Keyboard Support**:
    -   Add `onKeyDown` handler to the outer container.
    -   Listen for `Enter` or `Space` keys to trigger the "Select" action (same as click).
    -   When selected/focused, allow `Enter` to trigger "Edit Mode" (currently double-click).
4.  **ARIA**: Add `aria-label` with the node title.

### CanvasWidget.tsx (Optional but recommended)
- Ensure the focus ring is visible when a node is focused.

## Acceptance Criteria
- [ ] Users can Tab through the nodes on the canvas.
- [ ] Pressing `Enter` on a focused node selects it.
- [ ] Pressing `Enter` on a selected node enters "Edit Mode".
- [ ] Screen readers announce the node title.
