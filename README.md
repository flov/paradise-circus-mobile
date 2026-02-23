# Paradise Circus Mobile

Expo React Native app for the Paradise Circus workshop booking and community platform in Pai, Thailand. Companion to the [web app](../web).

## Prerequisites

- Node.js 18+
- pnpm
- iOS Simulator (macOS) or Android Emulator
- [Expo Go](https://expo.dev/go) (optional, for physical devices)

## Getting Started

```bash
pnpm install
pnpm start
```

Then run on a platform:

```bash
pnpm ios       # iOS simulator
pnpm android   # Android emulator
pnpm web       # Web (Expo web)
```

## Environment

Create `.env.local` in the project root:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

`API_BASE_URL` defaults to `http://localhost:3000` if unset. The web app must be running for API calls to succeed.

## Screens

| Tab | Screen | Description |
|-----|--------|-------------|
| Weekly | `(tabs)/index.tsx` | Timetable with day chips, event cards, expand to add to schedule |
| My Schedule | `(tabs)/schedule.tsx` | Locally saved events (AsyncStorage) |
| Artists | `(tabs)/artists.tsx` | Artist list with search |
| — | `artists/[username].tsx` | Artist profile (props, bio, workshops) |

## Tech Stack

- **Expo 54** + React Native 0.81
- **Expo Router** — file-based navigation
- **TanStack Query** — data fetching
- **NativeWind** — Tailwind CSS for React Native
- **Clerk** — auth (ready, not yet gating screens)

## API

The app consumes the web app's REST API:

- `GET /api/timetable/public?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /api/artists`
- `GET /api/artists/:username`

## Project Structure

```
app/
├── _layout.tsx          # Provider stack
├── (tabs)/              # Tab screens
│   ├── index.tsx        # Weekly timetable
│   ├── schedule.tsx     # My Schedule
│   └── artists.tsx      # Artists list
└── artists/[username].tsx
lib/
├── api.ts               # API calls
├── schedule.ts          # useSavedEvents() — AsyncStorage persistence
├── types.ts             # TypeScript interfaces
└── utils.ts             # Shared helpers
constants/
├── config.ts            # API base URL
└── Colors.ts            # PC palette, getEventBorderColor, getAvatarBgColor
```
