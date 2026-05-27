# Graph Report - .  (2026-05-27)

## Corpus Check
- Large corpus: 78 files · ~791,968 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 81 nodes · 71 edges · 22 communities detected
- Extraction: 73% EXTRACTED · 27% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Color Unlock & Detail Pages|Color Unlock & Detail Pages]]
- [[_COMMUNITY_Skills Canvas Demos|Skills Canvas Demos]]
- [[_COMMUNITY_Nav, Cards & Unlock Hook|Nav, Cards & Unlock Hook]]
- [[_COMMUNITY_Scroll Zone Theming|Scroll Zone Theming]]
- [[_COMMUNITY_Generic Project Detail|Generic Project Detail]]
- [[_COMMUNITY_Theme Color Lerp|Theme Color Lerp]]
- [[_COMMUNITY_App Shell & Home|App Shell & Home]]
- [[_COMMUNITY_Contact Form|Contact Form]]
- [[_COMMUNITY_Particle Background|Particle Background]]
- [[_COMMUNITY_About Section|About Section]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_Hero|Hero]]
- [[_COMMUNITY_Projects Grid|Projects Grid]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_App Entry|App Entry]]
- [[_COMMUNITY_Contact Test|Contact Test]]
- [[_COMMUNITY_ColorContext Test|ColorContext Test]]
- [[_COMMUNITY_Projects Data|Projects Data]]
- [[_COMMUNITY_ScrollZone Test|ScrollZone Test]]
- [[_COMMUNITY_Test Setup|Test Setup]]
- [[_COMMUNITY_Server|Server]]

## God Nodes (most connected - your core abstractions)
1. `useColorContext()` - 16 edges
2. `useColorUnlock()` - 5 edges
3. `ProjectDetail()` - 5 edges
4. `Navbar()` - 3 edges
5. `ProjectCard()` - 3 edges
6. `useScrollZone()` - 3 edges
7. `AmbientOverlay()` - 2 edges
8. `ParticleBackground()` - 2 edges
9. `ScrollZoneWatcher()` - 2 edges
10. `useThemeMono()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `ParticleBackground()` --calls--> `useColorContext()`  [INFERRED]
  frontend\src\components\ParticleBackground.jsx → frontend\src\context\ColorContext.jsx
- `ThemeEvolution()` --calls--> `useColorContext()`  [INFERRED]
  frontend\src\components\ThemeEvolution.jsx → frontend\src\context\ColorContext.jsx
- `AmbientOverlay()` --calls--> `useColorContext()`  [INFERRED]
  frontend\src\components\AmbientOverlay.jsx → frontend\src\context\ColorContext.jsx
- `Navbar()` --calls--> `useColorContext()`  [INFERRED]
  frontend\src\components\Navbar.jsx → frontend\src\context\ColorContext.jsx
- `Toast()` --calls--> `useColorUnlock()`  [INFERRED]
  frontend\src\components\Toast.jsx → frontend\src\hooks\useColorUnlock.js

## Communities

### Community 0 - "Color Unlock & Detail Pages"
Cohesion: 0.1
Nodes (9): ActionRpgDetail(), AmbientOverlay(), CollegeSocialDetail(), useColorContext(), FronteraDetail(), PokemonDetail(), Rapp956Detail(), RgvTutorDetail() (+1 more)

### Community 1 - "Skills Canvas Demos"
Cohesion: 0.22
Nodes (2): useThemeMono(), WebCodeInspector()

### Community 2 - "Nav, Cards & Unlock Hook"
Cohesion: 0.22
Nodes (4): Navbar(), ProjectCard(), Toast(), useColorUnlock()

### Community 3 - "Scroll Zone Theming"
Cohesion: 0.33
Nodes (2): ScrollZoneWatcher(), useScrollZone()

### Community 4 - "Generic Project Detail"
Cohesion: 0.53
Nodes (4): darkTint(), dimAccent(), getYouTubeId(), ProjectDetail()

### Community 5 - "Theme Color Lerp"
Cohesion: 0.67
Nodes (3): hexToRgb(), lerpColor(), ThemeEvolution()

### Community 6 - "App Shell & Home"
Cohesion: 0.67
Nodes (0): 

### Community 7 - "Contact Form"
Cohesion: 0.67
Nodes (0): 

### Community 8 - "Particle Background"
Cohesion: 0.67
Nodes (1): ParticleBackground()

### Community 9 - "About Section"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Footer"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Hero"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Projects Grid"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "App Entry"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Contact Test"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "ColorContext Test"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Projects Data"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "ScrollZone Test"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Test Setup"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Server"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `About Section`** (2 nodes): `About()`, `About.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer`** (2 nodes): `Footer()`, `Footer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Hero`** (2 nodes): `Hero.jsx`, `Hero()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Projects Grid`** (2 nodes): `Projects.jsx`, `Projects()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Contact Test`** (1 nodes): `Contact.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ColorContext Test`** (1 nodes): `ColorContext.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Projects Data`** (1 nodes): `projects.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ScrollZone Test`** (1 nodes): `useScrollZone.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Setup`** (1 nodes): `setup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Server`** (1 nodes): `serve.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useColorContext()` connect `Color Unlock & Detail Pages` to `Nav, Cards & Unlock Hook`, `Scroll Zone Theming`, `Generic Project Detail`, `Theme Color Lerp`, `Particle Background`?**
  _High betweenness centrality (0.316) - this node is a cross-community bridge._
- **Why does `useScrollZone()` connect `Scroll Zone Theming` to `Color Unlock & Detail Pages`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `ProjectDetail()` connect `Generic Project Detail` to `Color Unlock & Detail Pages`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `useColorContext()` (e.g. with `AmbientOverlay()` and `Navbar()`) actually correct?**
  _`useColorContext()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useColorUnlock()` (e.g. with `Navbar()` and `Toast()`) actually correct?**
  _`useColorUnlock()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Navbar()` (e.g. with `useColorUnlock()` and `useColorContext()`) actually correct?**
  _`Navbar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ProjectCard()` (e.g. with `useColorUnlock()` and `useColorContext()`) actually correct?**
  _`ProjectCard()` has 2 INFERRED edges - model-reasoned connections that need verification._