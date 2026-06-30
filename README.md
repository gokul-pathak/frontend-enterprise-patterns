# Frontend Enterprise Patterns

A frontend architecture showcase repo demonstrating reusable patterns, scalable component design, and maintainable React/Next.js/TypeScript structure.

## Purpose

This repository reflects how I approach frontend engineering in real projects: organizing code clearly, building reusable components, and keeping architecture scalable. It is built with real OAuth integrations, real GraphQL/REST API fetching, and strict architectural boundaries.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (Strict mode)
- **Styling**: Material UI + Tailwind CSS
- **Server State**: TanStack React Query
- **Client State**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **HTTP**: Axios with interceptors
- **API**: REST + GitHub GraphQL
- **Auth**: NextAuth.js (OAuth)
- **Testing**: Vitest + React Testing Library + MSW
- **Linting**: Oxlint + ESLint + Prettier
- **Git Hooks**: Husky + lint-staged + Commitlint (Conventional Commits)

## What This Repo Demonstrates

- Feature-first architecture (Bulletproof React pattern)
- Reusable UI component library (`Button`, `Input`, `Avatar`, `Modal`, `ConfirmDialog`)
- Strict separation of server state (React Query) vs client state (Redux)
- Zod schema validation with React Hook Form integration
- Axios interceptors for centralized auth and error handling
- GitHub GraphQL API integration alongside REST
- SEO with Next.js Metadata API, Open Graph, JSON-LD structured data
- Accessibility: skip-to-content, aria-labels, keyboard navigation
- Performance: `useMemo`, `useCallback`, `next/dynamic`, `next/image`
- Global error handling with Error Boundaries, 404, 403 pages
- Responsive design with MUI breakpoints and Tailwind utilities
- Clean commit history following Conventional Commits

## Architecture

Code is organized by **feature domain** rather than technical type. Each feature owns its own components, hooks, API layer, and types. Shared UI and utilities live separately.

### Why this matters

When the app scales, a developer working on "users" only touches `features/users/`. They never accidentally break auth or notes. This is how enterprise teams organize frontend code.

### State Management Strategy

| State Type | Tool | Example |
|---|---|---|
| Server/async data | React Query | Dashboard stats, GitHub connections |
| Client/sync UI state | Redux Toolkit | Theme mode, notes CRUD, notifications |

React Query handles caching, background sync, and deduplication for API data. Redux is strictly for global UI state that doesn't belong in a database. Using both avoids stale state bugs that happen when Redux manages API data.

### API Layer

- **REST**: Standard CRUD operations via Axios with centralized interceptors
- **GraphQL**: GitHub API for fetching deeply nested data (followers, repos, PRs, commits) to avoid over-fetching

## Folder Structure

```
src/
├── app/                    # Next.js App Router (layouts, pages, error boundaries)
│   ├── (auth)/             # Auth route group (login, unauthorized)
│   ├── (dashboard)/        # Protected route group (dashboard, users, profile, notes)
│   └── api/                # API routes (NextAuth)
├── features/               # Feature-sliced modules
│   ├── auth/               # Login form, AuthGuard, schemas
│   ├── dashboard/          # Stats cards, recent activity, skeleton loaders
│   ├── notes/              # CRUD notes with Redux + Zod validation
│   ├── profile/            # Profile page with Redux state
│   └── users/              # Connections list, detail modal, GraphQL hooks
├── lib/                    # Third-party configs (Axios instance, React Query client)
├── providers/              # App-level providers (MUI theme, Redux, React Query)
├── shared/                 # Reusable UI components and hooks
│   ├── components/         # Button, Input, Avatar, Modal, ConfirmDialog, etc.
│   └── hooks/              # Shared custom hooks
├── store/                  # Redux store, slices (theme, notes, profile, notifications)
├── tests/                  # Unit and integration tests
│   ├── unit/
│   ├── integration/
│   └── utils/
└── types/                  # Global TypeScript interfaces
docs/                       # Engineering decisions and AI workflow documentation
```

## Key Patterns

### Form Validation
Every form uses React Hook Form with Zod schema validation. Zod infers TypeScript types directly from schemas, so the validation rules and the types never drift apart.

### Error Handling
- `error.tsx` — catches UI errors per route segment
- `global-error.tsx` — fallback for fatal application crashes
- `not-found.tsx` — custom 404 page
- `unauthorized/page.tsx` — custom 403 page
- Retry UI on failed API requests via React Query's `refetch()`

### SEO
Uses the Next.js Metadata API for title, description, canonical URLs, Open Graph, Twitter Cards, and robots config. JSON-LD structured data is injected for search engine context.

### Accessibility
Skip-to-content link for keyboard users. MUI components handle `aria-describedby` and `aria-invalid` natively. All interactive buttons have explicit `aria-label` attributes.

### Performance
- `useMemo` for expensive computations (DataGrid column definitions)
- `useCallback` for stable event handler references
- `next/dynamic` for lazy-loading heavy components
- `next/image` for automatic image optimization (WebP, lazy loading)

## How to Run

```bash
npm install
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:oxlint` | Run Oxlint (fast linter) |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run coverage` | Generate test coverage report |

## Notes

This repo is intended to show how I structure and scale frontend code in a professional environment. For detailed reasoning behind each technology choice, see [Engineering Decisions](docs/engineering-decisions.md).
