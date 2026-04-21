# Code Patterns

Conventions and recurring patterns in the codebase. Reference this instead of reverse-engineering the same pattern multiple times.

## Format
- **Pattern**: Name of the convention
- **Where**: Files or components that use it
- **What it does**: Purpose
- **Example**: Brief code snippet or path

---

## Examples (remove when adding real patterns)

### API Call Wrapper
- **Where**: `/frontend/src/lib/api.ts` (or similar)
- **What it does**: All fetch requests go through a single wrapper that handles auth headers, error logging, retry logic
- **Example**: `const data = await api.get('/projects', { headers: authToken })`
- **Why**: Centralized error handling; easier to add logging or rate-limiting later

### Project Card Color Unlock
- **Where**: `ProjectCard.tsx`, `useColorUnlock.ts`
- **What it does**: When a card is clicked, its accent color is added to a global state and renders as an ambient gradient
- **Example**: `onClick` triggers `unlockColor(projectId)` which updates React context
- **Why**: Avoids prop drilling; reusable for future pages that need the same mechanic

### Environment Variables
- **Where**: `.env.local` (frontend), `.env` (backend)
- **What it does**: API URLs, MongoDB URI, API keys are never hardcoded
- **Example**: `REACT_APP_API_URL=http://localhost:3001` in frontend, `MONGO_URI` in backend
- **Why**: Safe for git; easy to swap for production without code changes

---
