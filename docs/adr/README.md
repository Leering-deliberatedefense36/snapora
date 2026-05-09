# Architecture Decision Records

ADRs capture _why_ we made a structural choice. They are not a how-to; they're a memory aid. Add a new ADR when:

- You picked a stack / library / framework
- You changed a contract that other modules depend on (IPC shape, storage schema)
- You ruled out an obvious alternative — write down why so the next contributor doesn't have to re-litigate it

## Format

Each ADR is a short markdown file numbered sequentially: `NNNN-title.md`.

```markdown
# NNNN — Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded by ADR-XXXX

## Context

What forced the decision. The constraints, deadlines, prior art.

## Decision

What we chose, in one or two sentences.

## Consequences

What this enables, what this prevents, what we'll have to live with.

## Alternatives considered

Listed alternatives + the one-line reason they were ruled out.
```

## Index

- [0001 — Stack choice: Electron + React](0001-stack-electron-react.md)
- [0002 — Main process is CJS, not ESM](0002-main-process-cjs.md)
