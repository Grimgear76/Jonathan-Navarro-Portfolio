# Project Gotchas

Bugs you've hit, counterintuitive behaviors, and lessons learned. Save future debugging time.

## Format
- **Gotcha**: What broke or surprised you
- **When**: Under what conditions it happens
- **Root cause**: Why it happens
- **Fix/Workaround**: How you solved it or worked around it
- **Prevention**: How to avoid it in the future

---

## Examples (remove when adding real gotchas)

### Scroll Event Performance on Mobile
- **Gotcha**: Color transition janky on iOS Safari, smooth on desktop
- **When**: Scrolling fast through multiple color zones
- **Root cause**: requestAnimationFrame throttling differs between browsers; CSS custom property updates are expensive during scroll
- **Fix**: Debounce scroll handler to every 50ms; use `will-change: background-color` on body
- **Prevention**: Always test scroll performance on real mobile devices, not just DevTools emulation

### MongoDB Connection Timeout on Cold Start
- **Gotcha**: First API call after deploy times out waiting for DB
- **When**: Deploying to Render/Railway free tier after inactivity
- **Root cause**: Render spins down free instances; connection pool needs to reinitialize
- **Fix**: Add `serverSelectionTimeoutMS: 10000` to mongoose connection; retry logic in frontend
- **Prevention**: Keep a heartbeat endpoint that pings the API every 30min; upgrade to paid tier if this becomes blocking

### React State Not Updating After Color Click
- **Gotcha**: Clicking a project card doesn't update unlock state
- **When**: Rapid clicks or clicking the same card multiple times
- **Root cause**: State update batching in React 18; callback not properly memoized
- **Fix**: Wrap handler in `useCallback`; ensure unlock state lives in context, not component local state
- **Prevention**: Use React DevTools Profiler to catch re-render issues early

---
