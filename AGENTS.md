# Agent Instructions

This project adheres to the **BMad Methodology**.

All agents (human or AI) interacting with this codebase **MUST** read and follow
the system instructions located at:

👉 [`.bmad/instructions.md`](.bmad/instructions.md)

Agents MUST initialize their context by reading that file before performing any action.

---

## Repository-Specific Rules (MANDATORY)

The rules below are **additive** to BMad and apply specifically to this repository.

### 1. Definition of Done (DoD)

A task is considered **complete** ONLY if **all** of the following are true:

1. Code builds and/or runs without errors.
2. All existing tests pass.
3. Any new or changed behavior is:
   - covered by tests, **OR**
   - explicitly justified why tests are not required.
4. Public-facing behavior, APIs, or assumptions are documented where relevant
   (README, docs/, or inline comments).
5. No unused code, TODOs, debug artifacts, or speculative abstractions remain.

If any of the above cannot be satisfied, the agent MUST stop and explain why.

---

### 2. Mandatory Checks

Before submitting results, agents MUST consider or run the following:

- Tests: `<INSERT TEST COMMAND>`
- Lint / Typecheck: `<INSERT COMMAND OR N/A>`

If a check cannot be executed in the current environment, the agent MUST:
- state this explicitly
- explain the limitation
- list potential risks

---

### 3. Decision Memory

For **non-trivial** changes (architecture, behavior, workflow, or conventions),
agents SHOULD append a short entry to:

- `docs/DECISIONS.md`

Recommended format:
- Context
- Decision
- Rationale
- Trade-offs

This file serves as persistent project memory for future agents.

---

### 4. Project Invariants

The following invariants MUST NOT be broken:

- Architectural layering (core / application / presentation separation)
- Existing public APIs without explicit decision record
- Test stability and determinism

If an agent is unsure whether a change violates an invariant,
it MUST stop and ask for clarification.

---

### 5. Anti-Slop Rule

Agents MUST NOT:
- introduce unused abstractions
- add features without a clear requirement
- refactor code without a stated benefit
- generate large changes without prior approval or decomposition

Prefer small, explicit, reviewable changes over “clever” solutions..
