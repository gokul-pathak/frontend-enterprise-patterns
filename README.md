# Meridian — People Operations Platform

An internal HR and People Ops platform for managing team members, performance, and organizational data. Built as an enterprise-grade Next.js application demonstrating production-quality engineering patterns.

---

## Running locally

```bash
cp .env.local.example .env.local
# Fill in Firebase credentials. GitHub token is optional (GraphQL demo).
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with a demo credential from the login page.

| Email | Password | Role |
|---|---|---|
| admin@meridian.io | password123 | Admin |
| manager@meridian.io | password123 | Manager |
| employee@meridian.io | password123 | Employee |

---

## Project structure

```
src/
├── app/                    Next.js App Router (pages + layouts)
│   ├── (auth)/             Route group: unauthenticated routes
│   └── (dashboard)/        Route group: authenticated routes
├── features/               Feature-first modules
│   ├── auth/               Login, JWT, guards, refresh
│   ├── dashboard/          Stats + activity
│   ├── users/              CRUD + GraphQL
│   ├── profile/            Edit form (RHF + Zod)
│   └── notifications/      Firebase FCM
├── shared/
│   ├── components/         Reusable UI primitives
│   └── hooks/              Non-feature-specific hooks
├── store/                  Redux slices
├── providers/              React context composition
├── lib/                    Infrastructure (Axios, Firebase, QueryClient)
└── types/                  Shared TypeScript types
```

### Why feature-first?

A type-first structure (`components/`, `hooks/`, `services/` at the root) forces you to jump between directories to understand a single feature. With feature-first, everything related to authentication lives in `features/auth/`. When a feature grows, it stays self-contained. When it's deleted, one folder disappears.

Every `index.ts` barrel file in a feature exports the public API. Code outside the feature imports from `@/features/auth`, not from `@/features/auth/hooks/useLogin`. This is a deliberate seam — it lets us refactor internals without touching callers.

---

## Authentication

**Flow:** Login → JWT access token (in memory) + refresh token (localStorage) → silent refresh on 401 → redirect to `/login` on refresh failure.

**Why not cookies?** This is a client-rendered SPA with no dedicated API server. `httpOnly` cookies require a server to set them. In production with a proper backend, the refresh token would be an `httpOnly` cookie. The code is written to make this swap trivial — `tokenUtils.ts` is the only file that touches storage.

**Auth guard strategy:** The `AuthGuard` component reads from Redux synchronously. It uses an `isInitialized` flag to prevent a flash-of-redirect while the app attempts to rehydrate from a stored refresh token on mount. The sequence is:
1. App mounts → `AuthInitializer` runs `useAuthInit()`
2. `useAuthInit` checks localStorage for a refresh token
3. If found, calls `/api/auth/refresh` to get a new access token
4. Decodes JWT payload to extract user claims
5. Dispatches `setCredentials` + `setInitialized`
6. `AuthGuard` sees `isInitialized: true` and proceeds

**Why Redux for auth, not React Query?** Auth state is synchronous client state. There's no server to query — we're checking what's in memory. React Query is designed for async server state. Using it for auth would mean an unnecessary `useQuery` call on every component that needs the current user.

---

## API layer

```
Axios instance (lib/axios.ts)
    ├── Request interceptor: attach Authorization header
    └── Response interceptor: 401 → refresh → retry (with queue for concurrent requests)

Service layer (features/*/api/)
    └── Plain async functions. No React. Testable in isolation.

React Query hooks (features/*/hooks/)
    └── Wraps service functions. Owns loading/error/cache behavior.
```

**Repository pattern:** `authService.ts` is not a class — it's a module of async functions. The "repository" is the module boundary, not an OOP abstraction. This is the minimal useful version of the pattern: data access code is separate from UI code without the overhead of classes and interfaces.

**Why not `fetch` directly in pages?** Two reasons: (1) The Axios interceptor handles auth and retry transparently. Every API call gets this for free. (2) Services are testable without rendering — just mock `apiClient` and call `login()`.

---

## State management

**Redux stores:**
- `auth` — Current user + access token. Synchronous, never stale.
- `theme` — Light/dark mode. No server round-trip.
- `notifications` — Toast queue. Decoupled from the UI tree.

**React Query stores:** Everything else. Dashboard stats, user list, profile data — these are server state. React Query owns caching, background refetch, and stale-while-revalidate for all of them.

**The rule:** If you're tempted to put server data into Redux, ask: "Would this data still be correct if two browser tabs were open?" If no, it belongs in React Query. Redux is for client state that has no server representation.

---

## Forms

The profile form (`features/profile/components/ProfileForm.tsx`) demonstrates:

**React Hook Form:** Uses uncontrolled inputs by default. A form with 12+ fields rendered as controlled components (re-render on every keystroke) would cause noticeable jank. RHF isolates updates to the specific input that changed.

**Zod:** The schema is the single source of truth. `z.infer<typeof profileSchema>` gives us the TypeScript type automatically. The schema validates nested objects (`address.*`) which RHF handles with dot-notation field names (`address.city`). No duplicated validation logic.

**`useEffect` reset:** When the server data changes (after a successful save, `useUpdateProfile` sets the cache directly), `defaultValues` updates and the form resets to reflect the saved state. Without this, the form would show stale values after saving.

---

## GraphQL

The `UserDetailModal` fetches GitHub contribution data via GraphQL. The specific query is in `features/users/api/usersGraphQL.ts`.

**Why GraphQL here, not REST?** The data is graph-shaped: `user → contributionsCollection → totalCommitContributions`. GitHub's REST API doesn't expose this in one call. The GraphQL API returns exactly what we ask for.

**Why not GraphQL everywhere?** Our own API returns flat, predictable JSON that REST handles perfectly. GraphQL adds a schema, query language, and often a client library (Apollo, urql) to the stack. That's worth it when the data is nested and variable — not worth it for a simple paginated list.

This file uses raw `fetch` rather than Apollo Client because it's a single query to a single external API. Apollo would add ~50kb to the bundle for no benefit here.

---

## Performance

| Optimization | Location | Why |
|---|---|---|
| `React.memo` | `StatsCard.tsx` | 4 cards re-render together; memo skips DOM updates for unchanged cards |
| `useMemo` | `AppProviders.tsx` (MUI theme) | Theme object recreated only when color mode changes |
| `useCallback` | `UsersPage.tsx` (handleDeleteConfirm) | Passed as prop to ConfirmDialog; without useCallback, new function identity on every render |
| Dynamic import | `ConfirmDialog`, `UserDetailModal` | Never in the initial bundle; loaded only when opened |
| `next/image` | `Avatar.tsx` uses MUI Avatar, not next/image | Avatar images are tiny (36px); next/image optimization is for large hero images |
| `placeholderData` | `useUsers.ts` | Keeps previous page visible while next page loads; eliminates loading flash on pagination |
| Debounce | `useDebounce.ts` in `UsersPage` | 400ms debounce on search prevents a query on every keystroke |

**What's not optimized:** The dashboard chart (not implemented — there's no charting library in this stack). Virtualization on the activity list (5 items don't need it; at 50+, we'd add react-virtual). Code splitting at the route level is handled by Next.js automatically.

---

## SEO

Next.js App Router's `metadata` API handles all SEO needs:

- **Root layout** (`app/layout.tsx`): Sets the title template (`%s | Meridian`), default description, Open Graph, and Twitter Card for the whole app.
- **Per-page** (`dashboard/page.tsx`, `users/page.tsx`, `profile/page.tsx`): Override the title. The template applies automatically.
- **Robots:** All authenticated routes are disallowed. This is an internal tool — search engine indexing of employee data would be a data exposure incident.
- **Sitemap:** Only exposes `/login`. Generated dynamically so the base URL comes from `NEXT_PUBLIC_APP_URL`.

Metadata is exported from Server Components only — this is a Next.js constraint. Pages that need client-side behavior export the page component as `'use client'` but keep `export const metadata` in a separate Server Component file, or (as done here) the page file is a Server Component that renders a client component inside it.

---

## Accessibility

- **Semantic HTML:** `<main>`, `<nav>`, `<header>`, `<h1>` used correctly in layouts.
- **ARIA:** `aria-current="page"` on active nav items, `aria-label` on icon buttons, `role="alert"` on error messages.
- **Focus management:** MUI Dialog (`Modal.tsx`) traps focus automatically. `focus-visible` CSS ensures keyboard users see focus indicators while mouse users don't.
- **Form accessibility:** All inputs have associated labels. Error messages use `aria-describedby` to link to the invalid field.
- **Keyboard navigation:** All interactive elements are reachable with Tab/Shift-Tab. The sidebar nav items are `<Link>` (native anchor) so they work with keyboard and screen readers.

---

## Testing strategy

**What we test:**

| Test | File | What it proves |
|---|---|---|
| Unit | `Button.test.tsx` | Component renders correctly in all states; event handlers fire |
| Hook | `useLogin.test.ts` | Mutation calls the right endpoint; success/error states work |
| Integration | `LoginForm.test.tsx` | Form validation, submission flow, MSW intercepts |

**What we don't test:**
- Snapshot tests — fragile, low signal. A snapshot failing because a class name changed is not a useful test.
- E2E tests — not in scope for this project; would use Playwright in production.
- Implementation details — we test behavior, not internals.

**MSW (Mock Service Worker):** All API calls are intercepted at the network level. This means hooks, forms, and pages are tested against realistic HTTP responses, not mocked module imports. The same mock handlers run in tests and in the browser (via `msw/browser`) for the development demo.

---

## Trade-offs and decisions

**MUI + Tailwind:** MUI handles complex interactive components (DataGrid, Dialog, DatePicker) that would take weeks to build correctly from scratch. Tailwind handles layout and spacing in custom components. They coexist without conflict — Tailwind's `@import 'tailwindcss'` (v4 syntax) scopes class names cleanly.

**No Storybook:** Added a component library documentation tool when you have >20 reusable components. With 10 carefully chosen components, the components are self-documenting through their usage in features.

**No Zustand:** Redux Toolkit's overhead is acceptable for the scale of this app, and it gives us Redux DevTools for free — invaluable for debugging auth flows.

**Apollo Client not used:** A single GraphQL query to an external API doesn't justify Apollo's bundle size (~50kb gzipped). Raw `fetch` with TypeScript types is sufficient.

**No server-side data fetching:** All pages use client-side React Query. For a public-facing app, we'd use `async` Server Components for initial data. For an authenticated internal tool, the auth check happens client-side anyway, so there's no SEO benefit to server rendering the data.

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint
npm run lint:oxlint  # Oxlint (faster, runs in parallel with ESLint in CI)
npm test             # Run all tests
npm run test:watch   # Tests in watch mode
npm run coverage     # Coverage report
```

 # #   D e p l o y m e n t 
 S e e   [ d o c s / d e p l o y m e n t . m d ] ( d o c s / d e p l o y m e n t . m d )   f o r   p r o d u c t i o n   d e p l o y m e n t   r e q u i r e m e n t s ,   i n c l u d i n g   h o w   t o   c o n f i g u r e   F i r e b a s e   C l o u d   M e s s a g i n g   s e r v i c e   w o r k e r s .  
 