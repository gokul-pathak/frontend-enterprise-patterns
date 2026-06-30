# Contributing to Meridian

## Getting started

```bash
cp .env.local.example .env.local
# Fill in your values

npm install
npm run dev
```

The app runs on `http://localhost:3000`. Sign in with any demo credential from the login page.

## Branch naming

Use the format: `<type>/<ticket-id>-<short-description>`

Examples:

- `feat/MRD-123-user-avatar-upload`
- `fix/MRD-456-token-refresh-race-condition`
- `refactor/MRD-789-profile-form-validation`

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/). Husky enforces this on every commit.

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `ci`

Examples:

```
feat(users): add bulk deactivation action
fix(auth): handle refresh token race condition
test(profile-form): add validation edge case coverage
```

## Code review

- PRs require at least 1 approval from `@meridian/frontend`
- Auth-related PRs require 2 approvals (see CODEOWNERS)
- Address all comments before merging
- Squash merge to main

## Running tests

```bash
npm test           # Run all tests once
npm run test:watch # Watch mode during development
npm run coverage   # Generate coverage report
```

## Architecture decisions

See the [README](./README.md) for a full explanation of why each technology was chosen and how the pieces fit together.
