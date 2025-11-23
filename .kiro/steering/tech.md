---
inclusion: always
---

# Tech Stack

## Core Technologies

- **Framework**: React 19.2.0 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React 0.554.0
- **Font**: Nunito (Google Fonts)

## Project Configuration

- **Module System**: ESNext with ES2022 target
- **JSX**: react-jsx (automatic runtime)
- **Path Aliases**: `@/*` maps to project root
- **Dev Server**: Runs on port 3000, host 0.0.0.0

## Environment Variables

- `GEMINI_API_KEY`: Set in `.env.local` for AI features
- Exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` in build

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Dependencies

- React DOM for rendering
- Lucide React for icon system
- No state management library (uses React hooks)
- No routing library (single-page app with tab navigation)

## Build Notes

- Uses Vite's fast HMR for development
- TypeScript with strict module resolution
- No test framework configured
- CDN-based Tailwind for rapid styling
