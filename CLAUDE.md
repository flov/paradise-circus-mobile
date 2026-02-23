# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from `/mobile`:

```bash
pnpm start     # Expo dev server
pnpm ios       # iOS simulator
pnpm android   # Android emulator
pnpm web       # Web (Expo web)
```

No test runner is configured. Use the Expo dev server to verify changes.

## Environment

Create `.env.local` with:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000   # points at the web app
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

`API_BASE_URL` defaults to `http://localhost:3000` if unset (`constants/config.ts`).

## Architecture

### Provider Stack (`app/_layout.tsx`)

```
ClerkProvider (publishableKey + SecureStore tokenCache)
  └── QueryClientProvider (staleTime: 60s, retry: 2)
        └── ThemeProvider (DarkTheme — always dark)
              └── Stack navigator
```

### Routing

Expo Router file-based navigation. Three tabs defined in `app/(tabs)/_layout.tsx`:
- `(tabs)/index.tsx` — Weekly timetable
- `(tabs)/schedule.tsx` — My Schedule (locally persisted)
- `(tabs)/artists.tsx` — Artist list with search
- `artists/[username].tsx` — Artist profile (Stack screen, not a tab)
- `app/(tabs)/two.tsx` — Legacy file, hidden via `href: null`; do not delete

### Data Fetching

All API calls live in `lib/api.ts` and use plain `fetch`. TanStack Query wraps them in screens:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ['timetable', start, end],
  queryFn: () => fetchTimetable(start, end),
});
```

API base URL comes from `constants/config.ts`. Endpoints consumed:
- `GET /api/timetable/public?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /api/artists`
- `GET /api/artists/:username`

### Local Persistence

`useSavedEvents()` in `lib/schedule.ts` manages the My Schedule tab. It stores `SavedEventSnapshot` objects in AsyncStorage under key `paradise_saved_events_v1`. The hook exposes: `savedEvents`, `toggle(event)`, `remove(id)`, `isGoing(id)`, `isLoaded`.

Events are snapshotted at save time — they do not sync back to the server.

### Timetable `isBlocked` Events

`lib/utils.ts#organizeEvents` creates phantom entries with `isBlocked: true` to fill multi-hour event slots in a grid layout. The timetable screen filters these out (`if (event.isBlocked) continue`).

### Types

All TypeScript interfaces are in `lib/types.ts`. They mirror the web API response shapes with no Drizzle dependencies. Add new types here when adding API endpoints.

### Utils

`lib/utils.ts` is adapted from the web app's utils. Key functions:
- `getWeekDates(weekOffset)` / `formatLocalDate(date)` — week navigation
- `isEventPast(date, endTime)` — uses Thailand UTC+7 offset
- `extractYouTubeId` / `extractVimeoId` — video embed helpers
- `getInitials`, `calculateYearsOfExperience` — artist profile helpers

## Styling

Use NativeWind (Tailwind `className`) for component styles. The PC palette is available as Tailwind colors in `tailwind.config.js`:

- `bg-pc-bg`, `bg-pc-card`, `text-pc-text`, `text-pc-textMuted`, `text-pc-accent`, etc.
- `getEventBorderColor(event.id)` and `getAvatarBgColor(username)` remain dynamic — use inline `style` for these (e.g. `style={{ borderLeftColor: getEventBorderColor(id) }}`).

## Path Alias

`@/*` resolves to the `mobile/` root (configured in `tsconfig.json`). Use it for all internal imports.

## Auth

Clerk is set up but not yet used for gating any screens. Tokens are stored via `expo-secure-store` through `lib/tokenCache.ts`. The `useAuth` / `useUser` hooks from `@clerk/clerk-expo` are available anywhere inside the provider tree.
