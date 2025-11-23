---
inclusion: always
---

# Project Structure

## File Organization

```
/
├── App.tsx              # Main application component with all UI logic
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── constants.ts         # Static data (users, dishes, categories, achievements)
├── index.html           # HTML template with Tailwind config
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript compiler options
├── package.json         # Dependencies and scripts
└── .env.local           # Environment variables (gitignored)
```

## Architecture Patterns

### Single-File Component Structure

The entire app lives in `App.tsx` with this organization:
1. Imports and type definitions
2. Custom hooks (e.g., `useMenuAggregator`)
3. Reusable components (Navbar, TabBar, CategoryManager)
4. Tab pages (HomePage, RecipesPage, SummaryPage, ProfilePage)
5. Main App component with state management

### State Management

- All state managed with React `useState` hooks in main App component
- Props drilling for data and callbacks
- No global state management library
- Local state in sub-components for UI interactions

### Data Model

**Core Types** (see `types.ts`):
- `Dish`: Recipe with ingredients, metadata, and stats
- `MenuItem`: Planned dish for a specific meal time
- `Category`: Recipe categorization
- `User`: Family member with avatar and achievements
- `Ingredient`: Food item with quantity, unit, and category
- `Achievement`: Gamification badges

**Static Data** (see `constants.ts`):
- `USERS`: Family members array
- `DISHES`: Recipe database
- `CATEGORIES`: Recipe categories
- `ACHIEVEMENTS`: Unlockable badges

### Component Patterns

- **Navbar**: Reusable header with back button and actions
- **TabBar**: Fixed bottom navigation (4 tabs)
- **Card-based layouts**: White cards on warm gray background
- **Modal overlays**: Full-screen slides for detail views
- **Active states**: Scale transforms and color changes on interaction

### Styling Conventions

- Tailwind utility classes throughout
- Custom color palette via `sg-*` classes
- Consistent spacing: px-4/px-5/px-6 for horizontal, py-2/py-3/py-4 for vertical
- Shadow system: `shadow-card` (subtle), `shadow-float` (prominent)
- Border radius: rounded-xl (12px), rounded-2xl (16px), rounded-3xl (24px)
- Font weights: font-bold (700), font-extrabold (800), font-black (900)

### Mobile-First Design

- Fixed positioning for tab bar and action buttons
- Safe area padding with `pb-safe` class
- Touch-optimized tap targets (min 44px)
- Horizontal scrolling for category pills
- Active scale transforms for tactile feedback
