# AccountConnect App

A full-stack GraphQL application for a hypothetical social banking platform, allowing users to view their account, manage transactions, and connect with other users.

---

## Demo

[Watch the demo on Loom](https://www.loom.com/share/eae4b457941c429bb42685c5c080d4ef)

---

## Documentation

- [Product Requirements (PRD)](PRD.md)

---

## Getting Started (Quick Start)

To start both the client and server simultaneously from the repository root:

1. **Install root dependencies**:

   ```bash
   npm install
   ```

2. **One-time setup** — install dependencies for both client and server:

   ```bash
   npm run install:all
   ```

3. **Configure environment variables** — follow the setup instructions in both [Client](#client) and [Server](#server) sections below.

4. **Run both projects**:

   ```bash
   npm run dev
   ```

Both projects will start in parallel. The server runs on port 8000 and the client on port 5173.

---

## Project Structure

```
account-connect-app/
├── client/src/
│   ├── apollo/         # Apollo Client setup
│   ├── assets/         # Static assets
│   ├── auth/           # Token storage
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # App shell and layout
│   │   ├── routing/    # Protected route wrapper
│   │   ├── transactions/ # Transaction-specific components
│   │   └── ui/         # Generic UI primitives
│   ├── graphql/        # GraphQL operations (operations.ts)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (formatting)
│   ├── pages/          # Route-level page components
│   ├── store/          # Redux store and slices
│   └── types/          # Shared TypeScript types
└── server/src/
    ├── config/         # Environment config
    ├── db/             # SQLite init and seed
    ├── graphql/        # Schema, resolvers, auth, errors
    │   ├── resolvers/  # Query and mutation resolvers
    │   └── schema/     # GraphQL type definitions
    ├── jobs/           # Background job scheduling
    ├── middleware/      # Express middleware (logger)
    ├── services/       # Business logic
    ├── types/          # Shared TypeScript types
    └── utils/          # Auth utilities, logger
```

---

## Demo Users (Development)

The server seeds accounts from the SQLite database on first run. Use any of the following credentials to sign in:

| Name | Email | Password |
| --- | --- | --- |
| Adaeze Okonkwo | `adaeze@connect.ng` | `password123` |
| Emeka Nwosu | `emeka@connect.ng` | `password123` |
| Fatima Bello | `fatima@connect.ng` | `password123` |
| Chidi Okeke | `chidi@connect.ng` | `password123` |
| Ngozi Eze | `ngozi@connect.ng` | `password123` |

> These credentials are for **local/demo use only**.

---

## How the User Flow Works (End to End)

1. **Start the API** — Run the GraphQL server so `POST /graphql` is available.
2. **Start the client** — Run the Vite dev server; the browser loads the React app.
3. **Sign in** — The login screen sends the `login` GraphQL mutation with email and password. The server validates credentials, returns a JWT and user fields. The client stores the token in localStorage and hydrates the Redux auth store.
4. **Authenticated requests** — For every subsequent GraphQL operation, Apollo attaches `Authorization: Bearer <token>`. The server resolves the user from the JWT and scopes data to that user.
5. **Dashboard** — The client runs the `profile` query (header) and `account` query (balance, address, description). The user can edit their address and description inline.
6. **Transactions** — Status tabs map to the `transactions` query `status` argument. Cursor-based pagination via `limit` and `after` arguments fetches pages iteratively. Clicking "Load more" merges new data into the table.
7. **Create a transaction** — The user fills in a merchant and amount. The client calls `createTransaction` with an idempotency key. The transaction starts as `pending` and auto-transitions to `posted` after 2 minutes.
8. **Reverse a transaction** — Only `posted` rows show a Reverse button. The client opens a confirmation modal, then calls `reverseTransaction`. On success, the list refreshes and a toast confirms the change.
9. **People** — The client runs the `users` query to list all other users. The user can follow or unfollow any of them.
10. **Following** — The client runs the `following` query to list users the current user follows, with an unfollow option.
11. **Sign out** — Clears the token and Redux auth state, then routes back to login.

If the token is missing or expired, protected operations fail with `UNAUTHENTICATED` and the client redirects to the login screen.

---

## Client

The client is a single-page application that communicates with the GraphQL API only. There is no separate REST layer.

### Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Build / dev | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| API | Apollo Client v4 (GraphQL over HTTP) |
| State | Redux Toolkit |
| Notifications | Sonner (toasts) |

### Prerequisites

- Node.js v22+ and npm v9+
- The **server** running and reachable at the URL in `VITE_GRAPHQL_URL`

### Setup

1. Navigate to the client directory and install dependencies:

   ```bash
   cd client
   npm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

Vite prints a local URL (usually `http://localhost:5173`).

### Environment Variables

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `VITE_GRAPHQL_URL` | **Yes** | `http://localhost:8000/graphql` | Full URL of the GraphQL HTTP endpoint. |

### Available Scripts (`client/`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite with HMR |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |

---

## Server

### Tech Stack

| Layer | Choice |
| --- | --- |
| Runtime | Node.js v22+ |
| Language | TypeScript |
| API | GraphQL via Apollo Server v4 |
| Framework | Express |
| Database | SQLite (via `@databases/sqlite`) |
| Authentication | JWT (`jsonwebtoken`) + `bcryptjs` |
| Security | Helmet |
| Logging | Winston + colors |
| Dev Server | nodemon + tsx |

### Prerequisites

- Node.js v22+
- npm v9+

### Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

   At minimum, set `JWT_SECRET` to a long random string:

   ```env
   NODE_ENV=development
   PORT=8000
   APP_URL=http://localhost
   JWT_SECRET=your-secret-key-here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The GraphQL endpoint is available at `http://localhost:8000/graphql`.

### Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `8000` | Server port |
| `APP_URL` | No | `http://localhost` | Base URL (used in logs) |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWTs. Must be set — no insecure fallback. |

### Available Scripts (`server/`)

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server with hot reload |
| `npm run compile` | Compile TypeScript to JavaScript |
| `npm start` | Compile and start production server |
| `npm run type:check` | TypeScript type checking |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## GraphQL API

The API is available at `POST /graphql`.

### Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via the `login` mutation.

---

### Queries

#### `profile`
Returns the authenticated user's profile.

```graphql
query {
  profile {
    id
    name
    email
    created_at
  }
}
```

#### `account`
Returns the authenticated user's account details.

```graphql
query {
  account {
    id
    account_number
    account_name
    balance
    address
    description
    created_at
  }
}
```

#### `transactions`
Returns a paginated connection of the authenticated user's transactions. `status` is optional — omit to return all statuses.

```graphql
query {
  transactions(status: posted, limit: 10, after: null) {
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    items {
      cursor
      transaction {
        id
        date
        merchant
        amount
        status
      }
    }
  }
}
```

#### `users`
Returns all other users with an `isFollowing` flag for the authenticated user.

#### `user(id)`
Returns a single user by ID with an `isFollowing` flag.

#### `following`
Returns the list of users the authenticated user currently follows.

---

### Mutations

#### `login`
Authenticates a user and returns a JWT.

```graphql
mutation {
  login(email: "adaeze@connect.ng", password: "password123") {
    token
    user {
      id
      name
      email
    }
  }
}
```

#### `updateAccount`
Updates the authenticated user's address and/or description. Both fields are optional.

```graphql
mutation {
  updateAccount(address: "123 Lagos St", description: "My account") {
    address
    description
  }
}
```

#### `createTransaction`
Creates a new transaction. Amount must be in **kobo**. An `idempotencyKey` is required to prevent duplicate submissions.

```graphql
mutation {
  createTransaction(
    merchant: "Shoprite"
    amount: 500000
    idempotencyKey: "uuid-here"
  ) {
    id
    merchant
    amount
    status
  }
}
```

#### `reverseTransaction`
Reverses a `posted` transaction. Only `posted` transactions can be reversed.

```graphql
mutation {
  reverseTransaction(id: "transaction-id") {
    id
    status
  }
}
```

#### `followUser`
Follows another user by ID. Returns the followed user.

#### `unfollowUser`
Unfollows a user by ID. Returns `true` on success.

---

### Transaction Status

| Status | Description |
| --- | --- |
| `pending` | Transaction created, awaiting processing |
| `posted` | Auto-transitions from `pending` after 2 minutes |
| `reversed` | Transaction reversed by the user |

---

### Error Codes

| Code | Description |
| --- | --- |
| `UNAUTHENTICATED` | Missing or invalid JWT |
| `INVALID_CREDENTIALS` | Wrong email or password |
| `NOT_FOUND` | Resource not found |
| `BAD_REQUEST` | Invalid operation (e.g. reversing a non-posted transaction) |
| `FORBIDDEN` | Insufficient permissions |
| `INTERNAL_SERVER_ERROR` | Unexpected server error (details logged server-side only) |

---

## Background Jobs

When a transaction is created, a job is scheduled to transition it from `pending` to `posted` after **2 minutes**.

- Jobs are persisted to SQLite and survive server restarts
- On startup, pending jobs are recovered and rescheduled with the correct remaining delay
- If the delay has already passed on restart, the job fires immediately

> ⚠️ This uses `setTimeout` and SQLite persistence. In production, replace with a persistent job queue such as **BullMQ** (Redis-backed).

---

## Data

The server uses SQLite for persistence (development). The database is seeded with 5 users and their accounts on first run.

| Table | Description |
| --- | --- |
| `users` | User accounts (passwords hashed with bcryptjs) |
| `accounts` | One account per user (balance in kobo) |
| `transactions` | User transactions |
| `jobs` | Persisted background jobs |
| `connections` | Follow relationships (directed: follower → following) |

> ⚠️ In production, replace SQLite with a proper database (e.g. PostgreSQL).

### Amounts

All monetary amounts are stored and transmitted in **kobo** (the smallest NGN unit). The client is responsible for formatting values to NGN currency for display (e.g. `500000 kobo` → `₦5,000.00`).

---

## Security Notes

- `JWT_SECRET` must be set via environment variable — no insecure fallback
- Passwords are hashed with `bcryptjs` — never stored or returned in plain text
- `userId` is never exposed in GraphQL responses
- All data is scoped to the authenticated user
- Internal error details are never leaked to the client — logged server-side only
- Input types are enforced at the GraphQL schema level
- CORS is restricted to known client origins
- HTTP security headers applied via Helmet

---

## Testing

The server has a `__tests__/` directory and Jest is configured as a dev dependency, but no tests have been written yet. Unit tests for services and integration tests for resolvers are the recommended starting point.

```bash
# Run tests (server)
cd server && npm test
```

---

## Development Workflow

### Pre-commit Hooks

On each commit, the hook runs in `server/`:

1. `npm run type:check` — TypeScript type checking
2. `lint-staged` — ESLint + Prettier on staged `.ts` files and Prettier on `.json`/`.md` files

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add reverse transaction mutation
fix: correct pagination cursor calculation
chore: update dependencies
```

### Branching

- Branch off `main` for all features and fixes
- Merge via pull request — no direct pushes to `main`

### Root Scripts

| Script | Description |
| --- | --- |
| `npm run install:all` | Install dependencies for both client and server |
| `npm run dev` | Run client and server concurrently |
| `npm run dev:server` | Run server only |
| `npm run dev:client` | Run client only |
