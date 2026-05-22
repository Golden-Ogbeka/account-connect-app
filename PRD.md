# Product Requirements Document (PRD): Account Connect App

## Overview

Account Connect is a full-stack social banking application that allows users to view and manage their account, create and reverse transactions, and connect with other users on the platform. The system simulates a personal finance and social networking platform built on a GraphQL API.

---

## Objectives

- Provide users with a clear, real-time view of their account balance and transaction history.
- Enable users to create transactions and reverse posted ones.
- Allow users to follow and unfollow other users on the platform.
- Ensure secure, authenticated access to all financial and social data.
- Demonstrate scalable fintech architecture with GraphQL, JWT auth, and cursor-based pagination.

---

## Target Users

- **Primary Users:** Account holders who need to view balances, manage transactions, and connect with others.
- **Secondary Users:** Backend systems managing transaction state transitions.

---

## Features

### Authentication

- Users sign in with email and password.
- A JWT is returned on successful login and attached to all subsequent requests.
- Protected routes redirect unauthenticated users to the login screen.
- Token expiry is handled gracefully with a redirect and user notification.

---

### Dashboard (Account Overview)

- Display the authenticated user's name and email.
- Show account details: account name, account number, balance (formatted as currency), address, and description.
- Allow the user to edit their address and description inline via a modal.

---

### Transactions

#### Transaction List

- Display a paginated list of the authenticated user's transactions.
- Each row shows: date, merchant name, amount (formatted as NGN currency), and status badge.
- Support cursor-based "Load more" pagination — new pages are merged below existing rows without disrupting scroll position.

#### Status Filter

- Tab-based filter: All, Pending, Posted, Reversed.
- Switching tabs resets pagination and fetches fresh data for the selected status.

#### Create Transaction

- A "New" button opens a modal form with merchant name and amount fields.
- Amount is entered in naira and converted to kobo before sending to the API.
- An idempotency key is generated client-side per submission to prevent duplicates.
- On success, the transaction list refreshes and a toast confirms creation.

#### Reverse Transaction

- Only `posted` transactions show a Reverse action.
- Clicking Reverse opens a confirmation modal showing the merchant and amount.
- On confirmation, the `reverseTransaction` mutation is called.
- On success, the list refreshes and a toast confirms the reversal.

---

### People

- Display a list of all other users on the platform.
- Each user shows their name, email, and a Follow/Unfollow button based on current follow state.
- Follow and unfollow actions update immediately with toast feedback.

---

### Following

- Display a list of users the authenticated user currently follows.
- Each entry shows name, email, and an Unfollow button.
- Empty state shown when the user follows no one.

---

## Technical Requirements

### Frontend

- Framework: React 19 with Vite
- Routing: React Router v7
- Styling: Tailwind CSS v4
- API: Apollo Client v4 (GraphQL over HTTP)
- Notifications: Sonner toasts
- Auth: JWT stored in localStorage, attached via Apollo auth link

### Backend

- Runtime: Node.js v22+
- Language: TypeScript
- API: GraphQL via Apollo Server v4 + Express
- Database: SQLite (development); replace with PostgreSQL in production
- Auth: JWT (jsonwebtoken)
- Logging: Winston (file + console)
- Background Jobs: setTimeout + SQLite persistence; replace with BullMQ in production

### Security

- JWT secret required via environment variable — no fallback
- All data scoped to the authenticated user
- Internal errors never leaked to the client
- Input validated at the GraphQL schema level
- CORS restricted to known client origins

### Data

- Amounts stored and transmitted in kobo (smallest NGN unit)
- Idempotency keys required for transaction creation
- Follow relationships stored as directed connections (follower → following)

---

## User Stories

### As a User

1. I want to sign in securely so only I can access my account.
2. I want to see my account balance so I know how much I have.
3. I want to view my transaction history so I can track my spending.
4. I want to filter transactions by status so I can focus on what matters.
5. I want to load more transactions without losing my scroll position.
6. I want to create a transaction so I can simulate a purchase.
7. I want to reverse a posted transaction so I can undo an error.
8. I want to follow other users so I can connect with people on the platform.
9. I want to see who I'm following so I can manage my connections.
10. I want to be notified when my session expires so I understand why I was redirected.

---

## Acceptance Criteria

- [ ] Login returns a JWT and redirects to the dashboard
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Dashboard displays account balance, name, number, address, and description
- [ ] Account address and description are editable
- [ ] Transaction list displays all required fields with correct formatting
- [ ] Status filter updates the transaction list correctly
- [ ] Load more appends new transactions without scroll disruption
- [ ] Create transaction validates input and prevents duplicates via idempotency
- [ ] Reverse only works for `posted` transactions
- [ ] Follow/unfollow updates immediately with feedback
- [ ] Following list reflects current follow state
- [ ] Session expiry redirects to login with a notification
- [ ] All amounts displayed in NGN currency format
- [ ] Error handling is comprehensive and user-friendly

---

## Out of Scope

- User registration UI
- Real payment processing
- Multi-currency support
- Push notifications
- Admin panel
- Advanced analytics

---

## Risks and Assumptions

- SQLite is used for development only; production requires a proper database
- Background jobs use setTimeout; production requires a persistent queue (BullMQ)
- No real payment processing — all transactions are simulated
- Passwords are stored in plain text in the seed data (development only)

---

## Transaction Status Lifecycle

```
created → pending → posted (auto after 2 min) → reversed (manual)
```

| Status | Description |
| --- | --- |
| `pending` | Transaction created, awaiting processing |
| `posted` | Auto-transitioned from pending after 2 minutes |
| `reversed` | Manually reversed by the user |
