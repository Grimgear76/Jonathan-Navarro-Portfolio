export const projects = [
  {
    id: 'pokemon-battle-bot',
    title: 'Pokémon Battle Bot',
    description: 'Reinforcement learning agent that learns competitive Pokémon strategy from scratch using MaskablePPO — trained to 18.4M timesteps.',
    technologies: ['Python', 'MaskablePPO', 'Stable-Baselines3', 'Gymnasium', 'poke-env', 'TensorBoard'],
    accentColor: '#ffa60d',
    monoAccentColor: '#ee9700',
    github: 'https://github.com/Grimgear76/Pokemon-Battle-Bot',
    images: [
      '/screenshots/pokemon-battle-bot/battle-demo.gif',
    ],
    detail: {
      problem: 'Pokémon battles are a hard RL problem: 839-dimensional game state, 11 possible actions per turn (4 moves + 6 switches + 1 forced default), partial information, and rewards that only arrive at the end of a ~47-turn game. Standard PPO samples illegal moves and diverges — the bot needs to learn which actions are even legal before it can learn strategy.',
      built: `Built a full RL training pipeline on top of Pokémon Showdown (local Node.js server) using poke-env as the battle connector and a custom Gymnasium environment. Key decisions:

• MaskablePPO (Stable-Baselines3): illegal action logits are forced to −∞ so the policy never samples invalid moves — this was essential for stable training.
• 839-dim observation vector encoding HP, moves, status conditions, and field effects for both sides.
• Shaped reward function: +2.0 win / −2.0 loss, +0.25 for KO'ing opponent, −0.25 for losing own Pokémon, ±0.04×HP for damage dealt/received — provides signal before the battle ends.
• 3-phase curriculum: Phase 1 trains from scratch vs a random bot to build legal play; Phase 2 seeds from the Phase 1 model and faces a heuristic opponent pool; Phase 3 evaluates against any target opponent.
• TensorBoard tracked episode reward, KL divergence, entropy loss, and explained variance across the full training run.`,
      outcome: 'Agent 29 — the final model — reached 18.4M+ timesteps trained over ~1.9 days of continuous learning. Metrics at convergence: 0.56 explained variance, ~0.021 KL divergence, −0.49 entropy loss, 47 turns average battle length. The bot beat the random baseline and demonstrated adaptive play including switching Pokémon in response to type disadvantages.',
    },
  },
  {
    id: 'rgv-tutor',
    title: 'RGV Tutor',
    description: 'Offline-first AI tutoring app with quizzes, flashcards, and local LLM inference — 2nd Place AI/ML Hackathon.',
    technologies: ['Flutter', 'Node.js', 'Ollama', 'SQLite'],
    accentColor: '#3dd6c8',
    monoAccentColor: '#007ef3',
    award: '2ND PLACE — AI/ML HACKATHON',
    github: 'https://github.com/Grimgear76/RGV_Tutor',
    demo: 'https://youtu.be/N7ju-QHTInc?si=ObeCHINYP1qyJAr9',
    images: [
      '/screenshots/rgv-tutor/SignIn.png',
      '/screenshots/rgv-tutor/Library.png',
      '/screenshots/rgv-tutor/Planner.png',
      '/screenshots/rgv-tutor/Ollama.png',
      '/screenshots/rgv-tutor/subject-select.png',
    ],
    detail: {
      problem: 'Students in the Rio Grande Valley lack affordable, personalized tutoring resources. Low-connectivity environments and cloud AI costs make real-time AI tutoring apps inaccessible for many.',
      built: 'Flutter mobile app backed by a Node.js server running Ollama for fully local LLM inference — zero API dependency. Features include quizzes, flashcards, a digital Book Hub for accessible learning, and SQLite persistence for session continuity. Designed with a lightweight architecture optimized for low-end devices.',
      outcome: '2nd Place at the AI/ML Hackathon: Intelligent Solutions to Real-World Problems. Demonstrated real-time AI tutoring with zero cloud API costs — fully runnable on a standard laptop.',
    },
  },
  {
    id: 'rapp956',
    title: 'RAPP956 Website',
    description: 'Single-page marketing website pitching a youth mental health & life skills program to RGV school districts — built and deployed to production.',
    technologies: ['Vite', 'React', 'CSS Modules', 'Cloudflare Pages'],
    accentColor: '#4ade80',
    monoAccentColor: '#16a34a',
    github: null,
    demo: 'https://rapp956-website.pages.dev/',
    demoLabel: 'LIVE SITE',
    detail: {
      problem: 'The Rise Above Pressure Program needed a professional online presence to pitch its youth mental health and life skills curriculum to Rio Grande Valley school districts — with no existing web footprint.',
      built: 'Single-page React app built with Vite and CSS Modules: multi-section layout (Hero, Problem, Program Components, Speakers, Contact) with anchor-based navigation and no external routing library. Styled with a gold/black design system using Google Fonts. Deployed to Cloudflare Pages with SPA redirect handling via _redirects.',
      outcome: 'Live production site serving real visitors and school district contacts across the Rio Grande Valley.',
    },
  },
  {
    id: '2d-action-rpg',
    title: '2D Action RPG',
    description: 'A complete 2D action RPG with combat systems, enemy AI, and progression built in Unity.',
    technologies: ['Unity', 'C#'],
    accentColor: '#9d7fff',
    monoAccentColor: '#a900ec',
    github: 'https://github.com/Grimgear76/2D-Action-RPG',
    detail: {
      problem: 'Designing a full game loop from scratch — player movement, enemy AI, combat feel, and progression systems — requires every system to work in concert.',
      built: 'Built in Unity with C# using object-oriented design principles: player controller with dash + melee combat, enemy state machines (patrol/chase/attack), inventory system, UI systems, and hand-crafted level design.',
      outcome: 'Fully playable vertical slice with multiple enemy types, a boss encounter, and a complete win/lose loop.',
    },
  },
  {
    id: 'college-social-app',
    title: 'College Social Life App',
    description: 'MERN stack social platform connecting college students around campus events.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    accentColor: '#f472b6',
    monoAccentColor: '#e70077',
    github: 'https://github.com/Grimgear76/College-social-life-app',
    detail: {
      problem: 'College students struggle to discover on-campus events and connect with peers who share their interests — information is scattered across flyers, GroupMe, and word of mouth.',
      built: 'Full MERN stack app with JWT auth, event creation and RSVP system, interest-based feed, and real-time notifications using Socket.io. Built RESTful APIs with Node.js and Express, responsive UI with React, and MongoDB for scalable data storage.',
      outcome: 'Functional MVP: user registration, event discovery, RSVP flow, and a live-updating feed filtered by user interests.',
    },
  },
  {
    id: 'frontera-hackathon',
    title: 'Frontera Gemini Hackathon',
    description: 'Financial analytics web app with interactive dashboards and Gemini AI coaching — 1st Place Financial Track.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI'],
    accentColor: '#58a6ff',
    monoAccentColor: '#003ce0',
    award: '1ST PLACE — FINANCIAL TRACK',
    github: 'https://github.com/Grimgear76/frontera-hackathon',
    detail: {
      problem: 'First-generation college students lack accessible, personalized financial guidance — budgeting, loans, and investing are overwhelming without context.',
      built: 'Full-stack financial analytics web app built in 24 hours: React frontend with interactive dashboards for real-time spending and savings visualization, RESTful APIs with Node.js and Express for data processing, MongoDB for user financial data storage, and Google Gemini integration for personalized AI financial coaching.',
      outcome: '1st Place in the Financial Track at the UTRGV Frontera Gemini Hackathon 2024. Delivered a complete, award-winning solution within the 24-hour competition window.',
    },
  },
  {
    id: 'roblox-ux-redesign',
    title: 'Roblox UX/UI Redesign',
    description: "Figma redesign of Roblox's core UI targeting improved discoverability, modern search, and a full design system.",
    technologies: ['Figma'],
    accentColor: '#fb923c',
    monoAccentColor: '#ec5f00',
    demo: 'https://www.figma.com/design/9GPGqfOMzfKncIsEdPU7s3/Roblox?node-id=0-1&t=gXAAUKJiuBYCu6vJ-1',
    demoLabel: 'FIGMA',
    detail: {
      problem: "Roblox's existing UI has discoverability issues, visual inconsistency across platforms, and an outdated aesthetic that doesn't reflect the platform's scale.",
      built: 'High-fidelity Figma prototype redesigning the home feed, game detail pages, search, and navigation. Conducted UX analysis to enhance usability and navigation flow. Includes a full design system: component library, color tokens, and typography scale.',
      outcome: 'Complete interactive prototype with 30+ screens, a reusable component library, and a style guide ready for developer handoff.',
    },
  },
]
