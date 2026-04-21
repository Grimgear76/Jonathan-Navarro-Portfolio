# Known Constraints

Hard blockers, limitations, and system boundaries that affect implementation decisions.

## Format
- **Constraint**: What can't be done or is limited
- **Reason**: Why it exists (browser API, MongoDB limitation, deployment platform, etc.)
- **Impact**: How it shapes your code or features
- **Workaround** (if any): How you're handling it

---

## Examples (remove when adding real constraints)

### No localStorage for Session State
- **Constraint**: Color unlock state must reset on refresh
- **Reason**: Design decision to keep every visit feeling fresh
- **Impact**: Can't persist user exploration across sessions; no analytics on "unlock patterns"
- **Workaround**: Session storage via React state only

### MongoDB Free Tier Connection Limits
- **Constraint**: Limited concurrent connections on Render/Railway free tier
- **Reason**: Hosting cost constraints
- **Impact**: Contact form submissions during traffic spikes might queue or fail
- **Workaround**: Queue submissions in browser if offline; retry on reconnect

### Vercel Deployment Node Version
- **Constraint**: Must support Node 18+ for API routes
- **Reason**: Vercel's default environment
- **Impact**: Can't use cutting-edge Node 22 syntax without transpilation
- **Workaround**: Stick to stable ES2021 features

---
