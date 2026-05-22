# AI Prompts and Results

This file logs all AI prompts and their corresponding results for auditing and tracking purposes.

## Purpose

This file provides an audit trail of AI-assisted development to ensure:

- Transparency in AI usage
- Traceability of generated code and decisions
- Accountability for changes introduced via AI

## Log Rules

- **Authorized Access Only:** `PROMPTS.md` is restricted to authorized developers and must not be exposed in production environments.
- **Sanitization Required:** Prompts and responses must be sanitized before logging to remove sensitive data, PII, secrets, tokens, credentials, and transaction details.
- **No Customer Data:** Do not log customer data, personally identifiable information, transaction details, or any sensitive financial information.
- **Review Required:** All AI-generated code must be reviewed and validated before use; AI output is not production-ready by default.
- **Regulatory Compliance:** Logs must comply with applicable data protection and financial regulations.
- **Not Source of Truth:** Logged AI responses are for reference only and must not be treated as verified or production-ready implementations.
- **No Secrets in Prompts:** Developers must not include secrets, credentials, or sensitive data in AI prompts.
- **Traceability:** Where applicable, link prompts to related commits, pull requests, or issue IDs.

## Log Format

- **Date:** YYYY-MM-DD HH:MM:SS
- **Prompt:** The user's prompt
- **Response:** The AI's response summary

---

### Date: 2025-07-14 00:00:00

**Prompt:**

Scaffold a full-stack GraphQL application with Express, Apollo Server, SQLite, JWT auth, and a React Vite client. Include users, accounts, transactions (with cursor-based pagination, idempotency, and background job for pending→posted), and social connections (follow/unfollow). Remove all testing infrastructure.

**Response:**

Scaffolded the full server with SQLite schema, seeded 5 users with accounts, implemented all GraphQL schema, resolvers, services, and mutations. Built the React client with Apollo Client v4, Tailwind CSS v4, React Router v7, and Sonner toasts. Implemented all pages: Login, Dashboard, Transactions, People, Following. Configured root concurrently scripts, pre-commit hooks, and removed all Jest/Vitest testing infrastructure. Created README.md, PRD.md, AGENTS.md, and PROMPTS.md.

---
