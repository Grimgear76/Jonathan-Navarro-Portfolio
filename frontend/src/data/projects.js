export const projects = [
  {
    id: 'pokemon-battle-bot',
    title: 'Pokémon Battle Bot',
    description: 'Reinforcement learning agent that masters competitive Pokémon battles using PPO.',
    technologies: ['Python', 'PPO', 'Stable-Baselines3', 'Gymnasium'],
    accentColor: '#e8a838',
    detail: {
      problem: 'Training an AI to play competitive Pokémon requires handling complex game state, partial information, and long-horizon rewards with sparse feedback.',
      built: 'Implemented a Proximal Policy Optimization agent using Stable-Baselines3 and a custom Gymnasium environment wrapping the Pokémon Showdown battle simulator.',
      outcome: 'Agent surpassed random baseline play and demonstrated adaptive battle strategies — switching moves based on type matchups — after extended training.',
    },
  },
  {
    id: 'rgv-tutor',
    title: 'RGV Tutor',
    description: 'AI-powered tutoring platform using local LLM inference — 2nd Place AI/ML Hackathon.',
    technologies: ['Flutter', 'Node.js', 'Ollama', 'SQLite'],
    accentColor: '#3dd6c8',
    detail: {
      problem: 'Students in the Rio Grande Valley lack affordable, personalized tutoring resources. Cloud AI costs make real-time tutoring apps expensive to run.',
      built: 'Flutter mobile app backed by a Node.js server running Ollama for fully local LLM inference. SQLite persists session history for continuity across conversations.',
      outcome: '2nd Place at the AI/ML Hackathon. Demonstrated real-time tutoring with zero cloud API costs — fully runnable on a laptop.',
    },
  },
  {
    id: 'frontera-hackathon',
    title: 'Frontera Gemini Hackathon',
    description: 'Financial literacy app built with Gemini AI — 1st Place Financial Track.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    accentColor: '#58a6ff',
    detail: {
      problem: 'First-generation college students lack accessible, personalized financial guidance — budgeting, loans, and investing are overwhelming without context.',
      built: 'Full-stack web app: React frontend, Express API, MongoDB storage, integrated with Google Gemini for personalized financial coaching based on the user\'s situation.',
      outcome: '1st Place in the Financial Track at Frontera Hackathon 2024.',
    },
  },
  {
    id: '2d-action-rpg',
    title: '2D Action RPG',
    description: 'A complete 2D action RPG with combat, levels, and enemies built in Unity.',
    technologies: ['Unity', 'C#'],
    accentColor: '#9d7fff',
    detail: {
      problem: 'Designing a full game loop from scratch — player movement, enemy AI, combat feel, and progression systems — requires every system to work in concert.',
      built: 'Built in Unity with C#: player controller with dash + melee combat, enemy state machines (patrol/chase/attack), inventory system, and hand-crafted level design.',
      outcome: 'Fully playable vertical slice with multiple enemy types, a boss encounter, and a complete win/lose loop.',
    },
  },
  {
    id: 'college-social-app',
    title: 'College Social Life App',
    description: 'MERN stack social platform connecting college students around campus events.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    accentColor: '#f472b6',
    detail: {
      problem: 'College students struggle to discover on-campus events and connect with peers who share their interests — information is scattered across flyers, GroupMe, and word of mouth.',
      built: 'Full MERN stack app with JWT auth, event creation and RSVP system, interest-based feed, and real-time notifications using Socket.io.',
      outcome: 'Functional MVP: user registration, event discovery, RSVP flow, and a live-updating feed filtered by user interests.',
    },
  },
  {
    id: 'roblox-ux-redesign',
    title: 'Roblox UX/UI Redesign',
    description: "Figma redesign of Roblox's core UI targeting improved discoverability and modern aesthetics.",
    technologies: ['Figma'],
    accentColor: '#fb923c',
    detail: {
      problem: "Roblox's existing UI has discoverability issues, visual inconsistency across platforms, and an outdated aesthetic that doesn't reflect the platform's scale.",
      built: 'High-fidelity Figma prototype redesigning the home feed, game detail pages, search, and navigation. Includes a full design system: component library, color tokens, and typography scale.',
      outcome: 'Complete interactive prototype with 30+ screens, a reusable component library, and a style guide ready for developer handoff.',
    },
  },
]
