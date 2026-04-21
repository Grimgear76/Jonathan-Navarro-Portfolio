# Architecture Notes

High-level system design, data flow, and component relationships. Reference for understanding the big picture.

## Format
- **Component/System**: What it is
- **Responsibility**: What it does
- **Dependencies**: What it relies on
- **Data flow**: How data moves through it
- **Notes**: Anything non-obvious

---

## Examples (remove when adding real architecture)

### Frontend: Color Unlock System
- **Responsibility**: Manages global state of which projects have been "unlocked"; renders ambient gradient overlay
- **Dependencies**: React Context API, useReducer, localStorage (if persisting)
- **Data flow**: 
  1. User clicks ProjectCard
  2. onClick handler calls `dispatch(unlockColor(projectId))`
  3. Reducer updates context state
  4. Page background renders radial-gradient with accumulated colors
  5. Progress bar updates "EXPLORED X%"
- **Notes**: Lives in `ColorContext.tsx`; single source of truth to avoid prop drilling

### Backend: Contact Form API
- **Responsibility**: Receives form submissions, validates, stores in MongoDB
- **Dependencies**: Express.js, mongoose, sendGrid (optional email notification)
- **Data flow**:
  1. POST /api/contact with form data
  2. Server validates name, email, message
  3. Creates document in contacts collection
  4. Returns 201 with submission ID
  5. Optional: sends confirmation email to user
- **Notes**: No auth required (public endpoint); consider rate-limiting to prevent spam

### Data Model: Project
- **Fields**: id, title, description, technologies, accent_color, link, demo_link, stats
- **Used by**: ProjectCard component, detail pages, color unlock system
- **Example**: See `/backend/models/project.js` or `/frontend/src/data/projects.json`

---
