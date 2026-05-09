# Protein Scout

A futuristic Progressive Web App for exploring proteins visually in 3D. Built with React, TypeScript, Vite, and modern web technologies.

## Features

- **3D Protein Visualization**: Interactive 3D viewer using Mol* and Three.js
- **Natural Language Search**: Search proteins by name, gene, disease, organism, or natural language
- **Similarity Explorer**: Navigate protein relationships in an explorable graph
- **Local AI Scientist**: Browser-based AI for explaining proteins and scientific concepts
- **Live Science Feed**: Real-time scientific discovery dashboard
- **Offline Mode**: Full functionality without internet connection
- **PWA**: Installable as a native app

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **3D/Visualization**: Mol*, Three.js, D3.js, Cytoscape.js
- **AI**: WebLLM, Transformers.js, ONNX Runtime Web
- **Storage**: IndexedDB, Dexie, Service Worker
- **Internationalization**: react-i18next

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific modules
│   ├── search/     # Protein search functionality
│   ├── viewer/     # 3D protein viewer
│   ├── similarity/ # Protein similarity explorer
│   ├── ai/         # Local AI scientist
│   ├── feed/       # Science feed
│   ├── discovery/  # Biological material discovery
│   └── offline/    # Offline functionality
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── services/       # API services
├── stores/         # State management
├── i18n/           # Internationalization
├── types/          # TypeScript type definitions
├── workers/        # Web Workers
└── sw/             # Service Worker
```

## Deployment

Deploy to Vercel, Netlify, GitHub Pages, or Cloudflare Pages.

The app is designed to work entirely client-side with no backend requirements.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
