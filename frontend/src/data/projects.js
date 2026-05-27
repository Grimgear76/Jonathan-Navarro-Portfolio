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
    description: 'Offline-first AI math tutoring app with local LLM inference, practice problems, a book hub, and a study planner — 2nd Place AI/ML Hackathon.',
    technologies: ['Flutter', 'Node.js', 'Ollama', 'Hive'],
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
      built: 'Flutter app that calls a local Ollama LLM (llama3.2:1b) directly over localhost for fully offline inference — zero API keys — with a lightweight Node.js/Express server handling book-download proxying. Features practice problems across multiple subjects, an EPUB/PDF Book Hub for offline reading, a calendar study planner, and QR-based subject sharing, all persisted on-device with Hive.',
      outcome: '2nd Place at the AI/ML Hackathon: Intelligent Solutions to Real-World Problems. Demonstrated real-time AI tutoring with zero cloud API costs — fully runnable on a standard laptop.',
    },
  },
  {
    id: 'rapp956',
    title: 'RAPP956 Website',
    description: 'Single-page marketing website pitching a youth mental health & life skills program to RGV school districts — built and deployed to production.',
    technologies: ['Vite', 'React', 'CSS Modules', 'Framer Motion', 'Cloudflare Pages'],
    accentColor: '#4ade80',
    monoAccentColor: '#16a34a',
    github: null,
    demo: 'https://rapp956-website.pages.dev/',
    demoLabel: 'LIVE SITE',
    detail: {
      problem: 'The Rise Above Pressure Program needed a professional online presence to pitch its youth mental health and life skills curriculum to Rio Grande Valley school districts — with no existing web footprint.',
      built: 'Single-page React app built with Vite and CSS Modules: multi-section layout (Hero, Problem, Program Components, Speakers, Contact) with anchor-based navigation and no external routing library, plus Framer Motion for scroll/entrance animations. Styled with a gold/black design system using the Bebas Neue + Inter Google Fonts. Deployed to Cloudflare Pages with SPA redirect handling via _redirects.',
      outcome: 'Live production site serving real visitors and school district contacts across the Rio Grande Valley.',
    },
  },
  {
    id: '2d-action-rpg',
    title: '2D Action RPG',
    description: 'A 2D action RPG built in Unity with melee combat, enemy AI, an inventory & shop economy, a quest system, a skill tree, and EXP-based leveling.',
    technologies: ['Unity', 'C#'],
    accentColor: '#9d7fff',
    monoAccentColor: '#a900ec',
    github: 'https://github.com/Grimgear76/2D-Action-RPG',
    detail: {
      problem: 'Designing a full game loop from scratch — player movement, enemy AI, combat feel, and progression systems — requires every system to work in concert.',
      built: 'Built in Unity with C# using object-oriented, data-driven design (ScriptableObjects for items, enemies, skills, and quests). Systems include melee combat with overlap-circle hit detection and knockback feedback, multiple enemy types (including a dynamite-thrower), a central StatsManager driving speed/damage/range, EXP-based leveling, a togglable skill tree, a quest system with objectives and rewards, and an inventory + shop economy with gold and loot drops. Co-developed with Dustin Boston.',
      outcome: 'Playable build with multiple enemy types, a working combat-and-leveling loop, quests, a skill tree, and a shop economy — plus a main menu and scene transitions.',
    },
  },
  {
    id: 'college-social-app',
    title: 'College Social Life App',
    description: 'MERN social platform where students post, like, and comment in a real-time feed — self-hosted with Socket.io live updates and exposed via Cloudflare Tunnel.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io', 'JWT'],
    accentColor: '#f472b6',
    monoAccentColor: '#e70077',
    github: 'https://github.com/Grimgear76/College-social-life-app',
    detail: {
      problem: 'College students want a campus-focused space to share posts and interact in real time — and building one end-to-end is a deep exercise in full-stack development, networking, and secure self-hosting.',
      built: 'Full MERN app: JWT authentication, a post feed with create/like/comment, a friends system, and live updates over Socket.io WebSockets. Hardened with helmet, global rate limiting, input sanitization, and express-validator. Self-hosted from a home server and exposed publicly through a Cloudflare Tunnel handling HTTPS and WebSocket routing.',
      outcome: 'Working platform with user registration, a live-updating post feed, likes and comments, and a friends system — deployed publicly through Cloudflare Tunnel.',
    },
  },
  {
    id: 'frontera-hackathon',
    title: 'Frontera Gemini Hackathon',
    description: 'Financable — a small-business financial toolkit with payroll & revenue calculators plus a Gemini-powered finance assistant — 1st Place Financial Track.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Google Gemini API'],
    accentColor: '#58a6ff',
    monoAccentColor: '#003ce0',
    award: '1ST PLACE — FINANCIAL TRACK',
    github: 'https://github.com/Grimgear76/frontera-hackathon',
    detail: {
      problem: 'Small-business owners juggle payroll, revenue, and tax math without accessible tools or guidance — and getting clear answers usually means spreadsheets or an accountant.',
      built: 'Multi-page web app (vanilla HTML/CSS/JavaScript) called Financable, built in 24 hours: a Salary Cost Calculator computing weekly/monthly/yearly payroll by hourly rate, hours, and employment type; a Revenue Calculator weighing income against salary and purchase expenses; a contact page; and "Financable Assist" — a chatbot powered by the Google Gemini API that answers small-business finance questions, with chat history persisted in localStorage.',
      outcome: '1st Place in the Financial Track at the UTRGV Frontera Gemini Hackathon 2024. Shipped a working multi-tool product with live Gemini-powered guidance within the 24-hour competition window.',
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
      problem: "Roblox's Charts and game lookup flow buries popular titles behind poor hierarchy and hard-to-scan lists — users struggle to discover new games without already knowing what to search for.",
      built: 'High-fidelity Figma prototype across 11 screens covering the full core app flow: login, register, home feed, charts, friends, avatar, settings, and more. The primary redesign focus was the Charts screen — restructured game rankings with clearer visual hierarchy, scannable cards, and an improved browsing flow that surfaces trending and top-rated titles without requiring a search query.',
      outcome: 'Complete interactive prototype covering all primary navigation flows with a consistent dark design language, delivering a game discovery experience that is meaningfully easier to navigate than the current Roblox UI.',
    },
  },
]
