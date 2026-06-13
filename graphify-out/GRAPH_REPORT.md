# Graph Report - C:\Users\Jonathan\OneDrive\Desktop\Jonathan-Navarro-Portfolio  (2026-06-13)

## Corpus Check
- 34 files · ~645,041 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 83 nodes · 73 edges · 22 communities detected
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]

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
  C:\Users\Jonathan\OneDrive\Desktop\Jonathan-Navarro-Portfolio\frontend\src\components\ParticleBackground.jsx → frontend\src\context\ColorContext.jsx
- `ThemeEvolution()` --calls--> `useColorContext()`  [INFERRED]
  C:\Users\Jonathan\OneDrive\Desktop\Jonathan-Navarro-Portfolio\frontend\src\components\ThemeEvolution.jsx → frontend\src\context\ColorContext.jsx
- `AmbientOverlay()` --calls--> `useColorContext()`  [INFERRED]
  frontend\src\components\AmbientOverlay.jsx → frontend\src\context\ColorContext.jsx
- `Navbar()` --calls--> `useColorContext()`  [INFERRED]
  C:\Users\Jonathan\OneDrive\Desktop\Jonathan-Navarro-Portfolio\frontend\src\components\Navbar.jsx → frontend\src\context\ColorContext.jsx
- `Toast()` --calls--> `useColorUnlock()`  [INFERRED]
  frontend\src\components\Toast.jsx → frontend\src\hooks\useColorUnlock.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (9): ActionRpgDetail(), AmbientOverlay(), CollegeSocialDetail(), useColorContext(), FronteraDetail(), PokemonDetail(), Rapp956Detail(), RgvTutorDetail() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.22
Nodes (2): useThemeMono(), WebCodeInspector()

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (4): Navbar(), ProjectCard(), Toast(), useColorUnlock()

### Community 3 - "Community 3"
Cohesion: 0.33
Nodes (2): ScrollZoneWatcher(), useScrollZone()

### Community 4 - "Community 4"
Cohesion: 0.53
Nodes (4): darkTint(), dimAccent(), getYouTubeId(), ProjectDetail()

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (1): ParticleBackground()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (3): hexToRgb(), lerpColor(), ThemeEvolution()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 9`** (2 nodes): `About()`, `About.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `Footer()`, `Footer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `Hero.jsx`, `Hero()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `Projects.jsx`, `Projects()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `Contact.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `ColorContext.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `projects.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `useScrollZone.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `setup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `serve.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useColorContext()` connect `Community 0` to `Community 2`, `Community 3`, `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.314) - this node is a cross-community bridge._
- **Why does `useScrollZone()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `ProjectDetail()` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `useColorContext()` (e.g. with `AmbientOverlay()` and `Navbar()`) actually correct?**
  _`useColorContext()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `useColorUnlock()` (e.g. with `Navbar()` and `Toast()`) actually correct?**
  _`useColorUnlock()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Navbar()` (e.g. with `useColorUnlock()` and `useColorContext()`) actually correct?**
  _`Navbar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ProjectCard()` (e.g. with `useColorUnlock()` and `useColorContext()`) actually correct?**
  _`ProjectCard()` has 2 INFERRED edges - model-reasoned connections that need verification._