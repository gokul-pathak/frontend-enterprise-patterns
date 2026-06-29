# Meridian - Enterprise Frontend Architecture Portfolio

Meridian is a production-ready Next.js application designed to demonstrate senior-level frontend engineering practices, scalable architecture, and modern toolchains.

This project is not a typical mock application; it is built with real OAuth integrations, real GraphQL/REST API fetching, and strict architectural boundaries. It is designed to be a technical showcase for frontend engineering interviews.

## Features

- **Real GitHub OAuth Authentication**: Implemented via NextAuth.js (Auth.js), proving real-world session management capabilities without relying on mock JWTs.
- **GitHub GraphQL Integration**: The dashboard fetches real-time repository and contribution statistics using the live GitHub GraphQL API.
- **GitHub REST API Integration**: The users table demonstrates server-side pagination and search using the GitHub REST API.
- **Dual State Management**: 
  - **Server State**: Managed strictly by TanStack React Query (caching, deduping, background refetching).
  - **Client State**: Managed strictly by Redux Toolkit (theme switching, global snackbar notifications).
- **Zod & React Hook Form**: Fully typed, accessible, and performant form validations.
- **Feature-Sliced Design**: The `/src/features` directory isolates modules (Auth, Dashboard, Users) for high maintainability.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Material-UI (MUI v5) + Emotion
- **Server State**: TanStack React Query v5
- **Client State**: Redux Toolkit
- **Authentication**: NextAuth.js (v4)
- **Form Handling**: React Hook Form + Zod
- **Networking**: Axios

## Architectural Decisions & "Why?"

### Why Next.js App Router?
The App Router provides superior performance through Server Components and advanced routing patterns. While much of this application is heavily client-side (due to the interactive dashboard nature), Next.js provides the robust foundation needed for future SEO and server-rendered optimizations.

### Why separate React Query and Redux?
In legacy codebases, developers often dumped all API responses into Redux, causing massive boilerplate and performance bottlenecks. Here, we demonstrate the modern enterprise standard: **React Query owns the server state** (async data, caching), and **Redux strictly owns the global UI state** (synchronous data like the current theme or toast notifications). 

### Why GitHub OAuth?
Mock authentication (like hardcoded username/password) is insufficient for demonstrating real-world security concerns. NextAuth securely handles the OAuth handshake, token storage, and session validation, providing a truly production-grade authentication flow.

## Getting Started

### Prerequisites
1. Node.js 20+
2. A GitHub account
3. A GitHub OAuth App (to get your Client ID and Secret)

### Setup
1. Clone the repository
2. Run `npm install`
3. Create a `.env.local` file in the root directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secure_string_here
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
```
4. Run `npm run dev`
5. Open `http://localhost:3000/login` and click **Sign in with GitHub**.

## Folder Structure

```
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
```

## Performance & Accessibility
- **Bundle Size**: Heavy components like Modals and Dialogs are dynamically imported (`React.lazy` / `next/dynamic`) to keep the initial JS payload small.
- **Accessibility**: All forms utilize proper `aria-` attributes, and color contrast ratios adhere to WCAG standards.
