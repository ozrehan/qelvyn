# Qelvyn — Cloud Workstations

Your workstation. Beyond your hardware.

Qelvyn provisions real cloud GPU workstations for creative professionals —
video editors and small production studios first. Black-and-white brand,
honest capability: anything not yet built is labeled **Concept**, never faked.

## Stack

- Next.js 15+ App Router + React + TypeScript (strict)
- Tailwind CSS v4 (`@theme` tokens: ink `#000000`, charcoal `#111111`, smoke `#777777`, paper `#FFFFFF`)
- Fonts: Inter (body) + Space Grotesk (display) via `next/font/google`
- Auth: next-auth v5 (database sessions) + credentials (bcrypt)
- DB: Postgres via drizzle-orm / postgres-js, migrations via drizzle-kit
- GPU provider: RunPod (GraphQL); `NullProvider` when no key is set
- Email: Resend (optional)
- Tests: vitest (unit) + Playwright (smoke)

## Local setup

```bash
npm ci
cp .env.example .env          # fill in DATABASE_URL + AUTH_SECRET at minimum
npm run db:migrate            # apply drizzle/ migrations
npm run dev
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

## Scripts

| Script          | What it does                              |
|-----------------|-------------------------------------------|
| `npm run dev`   | Start the dev server                      |
| `npm run build` | Production build (works with no DATABASE_URL) |
| `npm start`     | Serve the production build                |
| `npm run typecheck` | `tsc --noEmit`                        |
| `npm run db:generate` | Regenerate `drizzle/` migrations     |
| `npm run db:migrate`  | Apply migrations via tsx             |
| `npm run test`  | vitest unit tests (`lib/**/*.test.ts`)    |
| `npm run e2e`   | Playwright smoke tests (`tests/`)        |

## Env vars

| Var               | Required | Purpose                                  |
|-------------------|----------|------------------------------------------|
| `DATABASE_URL`    | yes      | Postgres connection string               |
| `AUTH_SECRET`     | yes      | next-auth secret (`openssl rand -base64 32`) |
| `AUTH_URL`        | yes      | Canonical app URL                         |
| `NEXT_PUBLIC_SITE_URL` | no  | Public site URL                           |
| `ADMIN_EMAILS`    | no       | Comma-separated admin emails              |
| `RUNPOD_API_KEY`  | no       | Enables real GPU provisioning; without it every provider method throws `ProviderNotConfiguredError` |
| `RESEND_API_KEY`  | no       | Enables email sending                     |
| `EMAIL_FROM`      | no       | From address (default `Qelvyn <noreply@qelvyn.example>`) |

## Deploy notes (Render)

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Health check: `GET /api/health` → `{ status, time, db, gpuProvider }`
- Set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` in the service env; run `npm run db:migrate` once against the database.

## Honesty principles

- Never fake provider state: if `RUNPOD_API_KEY` is unset, `getProvider()` returns
  `NullProvider` and every workstation action throws the exact message
  "GPU provider not connected — join the waitlist to get early access."
- Never fake email: without `RESEND_API_KEY`, `sendEmail` returns
  `{ sent: false, reason: "Email delivery is not configured yet." }`.
- Never fake billing: `estimateCost` is pure math over `WORKSTATION_PLANS`; no charges exist.
- Unbuilt product surface is labeled with the `Badge` `concept` tone.
