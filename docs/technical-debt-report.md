# Technical Debt & Modernization Report
**Date:** 2025-05-15
**Project:** Canvas-AI-Logic
**Status:** Analysis Complete

## Overview
This project was initialized with a standard Vite template that utilized versions of libraries which have since received major updates. While the application is functional, the development environment contains deprecated dependencies, security vulnerabilities (moderate severity), and legacy configuration formats.

To bring the project to a "Greenfield 2025" standard, a 3-phase modernization is recommended.

---

## 1. Security & Build System (Vite + Vitest)
**Current:** `vite@5.2.0`, `vitest@1.6.0`
**Target:** `vite@^6.0.0`, `vitest@^2.1.0` (or latest stable)

### Issues
- **Security:** `vite` v5 depends on an older `esbuild` version which has a moderate security vulnerability (allowing requests to dev server).
- **Deprecation:** Console warnings about `inflight`, `rimraf`, and `glob` largely stem from the dependency tree of older build tools.

### Migration Steps
1.  Run: `npm install -D vite@latest vitest@latest @vitejs/plugin-react@latest`
2.  **Verification:** Run `npm run dev` and `npm test`.
3.  **Note:** `vitest` v2+ aligns better with Vite's ecosystem. No code changes usually required for simple tests.

---

## 2. Linting & Quality (ESLint 9)
**Current:** `eslint@8.57.0` (Legacy Config)
**Target:** `eslint@^9.0.0` (Flat Config)

### Issues
- **Deprecation:** ESLint v8 is end-of-life. The console warnings during `npm install` regarding `@humanwhocodes` packages are direct dependencies of ESLint v8.
- **Config:** Project uses `.eslintrc.cjs`. New standard is `eslint.config.js` (Flat Config).

### Migration Steps
1.  Remove old deps: `npm uninstall eslint-plugin-react-hooks eslint-plugin-react-refresh @typescript-eslint/eslint-plugin @typescript-eslint/parser`
2.  Install new deps: `npm install -D eslint@latest globals @eslint/js typescript-eslint`
3.  **Delete** `.eslintrc.cjs`.
4.  **Create** `eslint.config.js` with the following structure:
    ```javascript
    import js from '@eslint/js';
    import globals from 'globals';
    import tseslint from 'typescript-eslint';
    import reactHooks from 'eslint-plugin-react-hooks';
    import reactRefresh from 'eslint-plugin-react-refresh';

    export default tseslint.config(
      { ignores: ['dist'] },
      {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
          ecmaVersion: 2020,
          globals: globals.browser,
        },
        plugins: {
          'react-hooks': reactHooks,
          'react-refresh': reactRefresh,
        },
        rules: {
          ...reactHooks.configs.recommended.rules,
          'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
      },
    );
    ```

---

## 3. Framework & Styling (React 19 + Tailwind 4)
**Status: COMPLETED (2025-05-21)**

### Improvements Implemented
- **React 19:** Upgraded to latest version. Removed legacy `forwardRef` usage. Verified `zustand` compatibility.
- **Tailwind 4:** Migrated to Tailwind CSS v4. Removed `tailwind.config.js` and `postcss.config.js`. Updated `vite.config.ts` and `src/index.css`.
- **UX:** Implemented Toast notification system (`useToastStore`) to replace console logs and alerts.

---

## 4. Accessibility & Testing (New Findings)
**Added:** 2025-05-15

### Accessibility (a11y)
- **Issues:**
    - `VisualNodeCard` uses `div` elements with `onClick` handlers without `role="button"` or `tabIndex`. This makes the application unusable for keyboard-only users.
    - Canvas navigation (pan/zoom) is mouse-only.
- **Recommendation:**
    - Convert interactive `div`s to `<button>` or add ARIA roles.
    - Implement keyboard shortcuts for canvas navigation (Arrow keys to pan, +/- to zoom).

### Test Coverage
- **Current State:** Testing is minimal.
- **Issues:**
    - Lack of End-to-End (E2E) tests.
    - Unit tests for Domain layer exist, but Widget/Presentation layers are under-tested.
- **Recommendation:**
    - Introduce **Playwright** for E2E testing, specifically for the "Chat -> Graph Update" flow.
    - Increase unit test coverage for `ElkAdapter` and `VisualNodeCard`.

### Feature Code Rot (Export)
**Status: FIXED**
- The "Export PNG" functionality has been restored by exposing a stable ID `canvas-export-root` in `CanvasWidget` and targeting it in `ChatSidebar`.

---

## Summary Recommendation
For the next agent/developer:
1.  Start with **Phase 1 & 2** combined. This cleans up the terminal output and secures the build.
2.  Perform **Phase 3** in a separate branch. Tailwind 4 significantly simplifies the setup (removes config files) but requires verifying that all styles (especially custom semantic colors used in `VisualNodeCard`) still apply correctly.
3.  **Priority:** Fix the "Export PNG" bug immediately as it is a broken feature in the UI.
