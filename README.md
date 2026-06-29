# GitHub Stats - Enterprise Frontend Architecture Portfolio

GitHub Stats is a production-ready Next.js application designed to demonstrate senior-level frontend engineering practices, scalable architecture, and modern toolchains.

This project is not a typical mock application; it is built with real OAuth integrations, real GraphQL/REST API fetching, and strict architectural boundaries. It is designed to be a technical showcase for frontend engineering interviews.

## Project Architecture
The application follows a Feature-first architecture (Feature-Sliced Design). Code is grouped by domain rather than technical type, ensuring that all components, hooks, and API calls related to a specific feature live together. This isolates concerns and scales well for large teams.

## Folder Structure
```text
src/
├── app/                  # Next.js App Router (Layouts & Pages)
├── features/             # Feature-sliced modules (Auth, Dashboard, Users)
│   └── [feature]/
│       ├── api/          # Axios service layer
│       ├── components/   # Feature-specific UI
│       ├── hooks/        # React Query hooks
│       └── types/        # TypeScript interfaces
├── lib/                  # Third-party configurations (Axios, React Query)
├── shared/               # Reusable UI components (Buttons, Inputs, Avatar)
└── store/                # Redux store configuration and slices
docs/                     # Architecture and AI documentation
```

## Authentication Flow
We utilize NextAuth.js (Auth.js) for a secure, robust OAuth flow. The client authenticates via a third-party provider (e.g., GitHub), and the session is managed securely on the server. API requests use Axios interceptors to automatically attach session tokens, and route guards prevent unauthorized access to private pages.

## Redux vs React Query
We enforce a strict separation of state:
- **Server State (React Query)**: Handles all asynchronous API data, caching, deduping, and background updates.
- **Client State (Redux Toolkit)**: Strictly reserved for synchronous, global UI state (e.g., theme switching, global modals, toast notifications) that doesn't belong in a database.

## API Layer
The application uses a hybrid API approach:
- **REST**: Utilized for standard CRUD operations and straightforward data fetching.
- **GraphQL**: Used for complex, deeply nested data requirements to eliminate over-fetching.
All requests are routed through Axios, configured with global interceptors for error handling and auth token injection.

## Performance Strategy
- **Code Splitting**: Heavy UI components (modals, complex charts) are dynamically imported (`next/dynamic`).
- **Caching**: React Query aggressively caches server responses.
- **Optimistic Updates**: UI reacts instantly to user input while background mutations complete.

## SEO Strategy
Next.js Server Components and dynamic metadata generation are leveraged to ensure that public-facing pages are fully indexable. Semantic HTML5 tags and proper heading hierarchies are enforced across all views.

## Accessibility Strategy
All interactive elements use appropriate `aria-` attributes. Color contrast ratios meet WCAG AA standards. Forms are navigable via keyboard, and focus management is handled for dynamic modal dialogs.

## Testing Strategy
- **Unit Tests**: Critical utilities and Redux reducers are tested in isolation.
- **Integration Tests**: React Testing Library is used to test feature workflows and React Query hooks.
- **Type Safety**: Strict TypeScript prevents runtime type errors before tests even run.

## Engineering Decisions
For a detailed breakdown of why specific technologies were chosen (e.g., Next.js, Zod, Oxlint), please see our [Engineering Decisions Document](docs/engineering-decisions.md).

## Trade-offs
- **Complexity vs. Boilerplate**: Redux and React Query together add initial setup complexity but drastically reduce technical debt as the app grows.
- **MUI vs. Tailwind**: We use MUI for rapid, accessible component composition, which increases bundle size slightly compared to a pure Tailwind approach, but ensures enterprise-grade accessibility out-of-the-box.

## Future Improvements
- Implement comprehensive e2e testing with Playwright.
- Migrate to Next.js partial pre-rendering for even faster initial loads.
- Add internationalization (i18n) support.
