# Agent Guidelines — AccountConnect App

## AI Interaction Logging

All AI agents interacting with this codebase must log each user prompt and the corresponding AI response in `PROMPTS.md` at the project root.

### Logging Procedure

After each interaction, append an entry to `PROMPTS.md` in this format:

```markdown
### Date: YYYY-MM-DD HH:MM:SS

**Prompt:**

[User's prompt here]

**Response:**

[AI's response summary here]

---
```

Rules:
1. Dates must be in ISO format with time.
2. Entries must be in chronological order — always append, never modify existing entries.
3. Sanitize all entries — remove PII, secrets, tokens, credentials, and financial data before logging.
4. Never log customer data, transaction details, or personally identifiable information.
5. `PROMPTS.md` must never be exposed in production environments.
6. All AI-generated code must be reviewed and validated before use.

---

## Code Style

- Use TypeScript for all new files — no plain JavaScript.
- Follow ES module syntax (`import`/`export`).
- Use camelCase for variables and functions, PascalCase for types and components.
- Use async/await for all asynchronous operations.
- Follow functional programming patterns — prefer pure functions over classes.
- Reuse existing patterns and utilities already in the codebase.
- Keep files focused — one concern per file.
- Minimize comments; write self-documenting code instead.
- Never use `any` — use proper types or `unknown`.

---

## Architecture

- **Server:** GraphQL API via Apollo Server v4 + Express. Services handle all business logic. Resolvers are thin — they call services and return results.
- **Client:** React SPA consuming the GraphQL API via Apollo Client v4. Pages are thin — they call hooks and render UI. No REST layer.
- **Database:** SQLite for development. All schema is defined in `server/src/db/index.ts`. Replace with PostgreSQL in production.
- **Auth:** JWT issued on login, stored in localStorage on the client, attached via Apollo auth link on every request. Server resolves user from JWT in context.
- **Background Jobs:** setTimeout + SQLite persistence for pending → posted transitions. Replace with BullMQ (Redis) in production.
- **Amounts:** Always in kobo (smallest NGN unit) on the wire. Client formats to NGN currency for display.

---

## Project Structure

```
account-connect-app/
├── client/src/
│   ├── apollo/         # Apollo Client setup
│   ├── auth/           # Token storage
│   ├── components/     # Reusable UI components
│   ├── context/        # React context (auth)
│   ├── graphql/        # GraphQL operations
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities (formatting)
│   ├── pages/          # Route-level page components
│   └── types/          # Shared TypeScript types
└── server/src/
    ├── config/         # Environment config
    ├── db/             # SQLite init and seed
    ├── graphql/        # Schema, resolvers, auth, errors
    ├── jobs/           # Background job scheduling
    ├── middleware/      # Express middleware (logger)
    ├── services/       # Business logic
    ├── types/          # Shared TypeScript types
    └── utils/          # Auth utilities, logger
```

---

## Security and Data Integrity

- Never trust client input — validate at the GraphQL schema level and in services.
- `JWT_SECRET` must come from environment variables — no hardcoded fallback.
- All data must be scoped to the authenticated user — never return another user's data.
- Internal error details must never be leaked to the client — log server-side only.
- Never expose `userId` or internal IDs in GraphQL responses unless required.
- Use idempotency keys for all transaction creation to prevent duplicates.
- CORS must be restricted to known client origins only.
- Passwords must never be logged or returned in API responses.
- Follow OWASP secure coding guidelines.

---

## Build and Run

```bash
# Install all dependencies
npm run install:all

# Run both client and server
npm run dev

# Server only
npm run dev:server

# Client only
npm run dev:client

# Type check server
cd server && npm run type:check

# Build client
cd client && npm run build
```

---

## Conventions

- Commit messages must follow Conventional Commits format (e.g. `feat:`, `fix:`, `chore:`).
- Branch for features, merge via pull requests.
- Never introduce new dependencies without justification.
- Never remove existing functionality unless explicitly instructed.
- Never refactor unrelated code in the same change.
- Store all secrets in environment variables — never in source code.
- Service functions must be suffixed with `Service` (e.g. `createTransactionService`).
- GraphQL operations on the client must be defined in `client/src/graphql/operations.ts`.

---

## Compliance

- Maintain audit trails for all financial transactions and user actions via Winston logs.
- Do not log customer data, transaction details, or PII in `PROMPTS.md` or application logs.
- Ensure AI agent activity complies with applicable data protection regulations.

---

## Priorities

1. Security
2. Data integrity
3. Correctness
4. Maintainability

---

## When Unsure

Ask for clarification rather than guessing. Do not make assumptions about business logic, especially for financial operations.
