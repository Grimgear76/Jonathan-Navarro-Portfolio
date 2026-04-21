# Design Decisions

Record non-obvious architectural and design choices made during development.

## Format
- **Decision**: What was chosen
- **Alternatives**: What was considered instead
- **Why**: The reasoning (constraints, performance, scope, user feedback, etc.)
- **Trade-offs**: What you gave up

---

## Examples (remove these when adding real decisions)

### Session Color State (Session-Only, No localStorage)
- **Decision**: Color unlock state resets on page refresh
- **Alternatives**: localStorage persistence, IndexedDB, server-side tracking
- **Why**: Every visit should feel like a fresh journey; simpler implementation; avoids stale state bugs
- **Trade-offs**: Users can't return to a partially-unlocked site; no data across devices

### Scroll-Driven Color Transition
- **Decision**: Smooth theme shift via CSS custom properties tied to scroll position
- **Alternatives**: Discrete color zones, per-section theming, no transition
- **Why**: Creates visual interest for recruiters scrolling; maintains monochrome elegance until unlocking begins
- **Trade-offs**: More complex scroll event handling; potential performance on older devices

---
