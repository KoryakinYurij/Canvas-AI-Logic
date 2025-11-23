# Story 5.2: Modernize Build System (Vite + ESLint)

**Epic:** 5 - Technical Debt & Modernization
**Status:** in-progress
**Estimate:** 2h

---

## Context
The project is currently using Vite 5 and ESLint 8 (Legacy Config). To ensure long-term maintainability, security, and compatibility with the React ecosystem (React 19, etc.), we need to upgrade the build tools and migrate to ESLint 9's Flat Config system.

References: `docs/technical-debt-report.md`

## Technical Changes

### Phase 1: Vite & Vitest
1.  Upgrade dependencies:
    -   `vite` -> latest
    -   `vitest` -> latest
    -   `@vitejs/plugin-react` -> latest
2.  Verify `vite.config.ts` compatibility.

### Phase 2: ESLint Migration
1.  Remove legacy dependencies:
    -   `eslint-plugin-react-hooks`
    -   `eslint-plugin-react-refresh`
    -   `@typescript-eslint/eslint-plugin`
    -   `@typescript-eslint/parser`
    -   `.eslintrc.cjs`
2.  Install new dependencies:
    -   `eslint` (v9+)
    -   `globals`
    -   `@eslint/js`
    -   `typescript-eslint`
3.  Create `eslint.config.js` implementing the recommended configuration.

## Acceptance Criteria
- [ ] `npm run dev` starts the application without errors or deprecation warnings.
- [ ] `npm test` runs and passes all tests.
- [ ] `npm run lint` executes successfully using the new ESLint 9 configuration.
- [ ] `package.json` reflects the new dependency versions.
