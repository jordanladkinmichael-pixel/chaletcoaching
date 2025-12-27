# PR 3.1 — Auth UI pages + returnTo (NextAuth v4 Credentials) — Cursor-ready prompt

You are working in an existing **Next.js App Router** project.

This PR must implement **custom auth pages** (sign in / sign up / reset password) that integrate with the project’s existing **NextAuth v4 Credentials provider** + **Prisma (Neon)**.

No other features in this PR (no guards, no dashboard changes). Keep the diff focused.

---

## 0) Non‑negotiable constraints

1) **Layout consistency**
- All pages must use the **same max width container as Home** (do not use full screen width).
- Render the same **SiteHeader** and **SiteFooter** as Home.

2) **No modals**
- Auth is always via pages, not dialogs.

3) **Return-to redirect**
- Every auth page must preserve and respect `returnTo` query param.
- After successful sign in/sign up, redirect to `returnTo` if provided, else `/dashboard`.

4) **WCAG 2.2 AA**
- Labels, focus rings, keyboard navigation, inline errors.

5) **Copy rule**
- Avoid em dashes in UI copy.

---

## 1) Pre-flight: confirm existing auth setup (do not rewrite it)
Locate and confirm:
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth.ts` exporting `authOptions`
- CredentialsProvider is already configured and works with bcrypt compare.

Do not change NextAuth config unless absolutely required for these pages.

---

## 2) Routes to implement (pages)

Create these routes:

- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `app/auth/reset-password/page.tsx`

Each page must:
- Use Home container width
- Use shared SiteHeader/SiteFooter
- Use existing design system (buttons, cards, spacing)

Tip: create a small shared wrapper component:
- `components/auth/AuthShell.tsx`
that renders header + container + footer, so the 3 pages are consistent.

---

## 3) /auth/sign-in — requirements

### UI
- H1: `Sign in`
- Fields:
  - Email
  - Password
- Primary button: `Sign in`
- Secondary links:
  - `Create an account` -> `/auth/sign-up` (preserve `returnTo`)
  - `Forgot password?` -> `/auth/reset-password` (preserve `returnTo`)

### Behavior
- Read `returnTo` from `searchParams` (client side `useSearchParams()`).
- Use `signIn("credentials", { email, password, redirect: false })`.
- On success: `router.push(returnTo ?? "/dashboard")`.
- On failure: show **inline error banner** (not only toast).

### UX states
- Loading: disable button, show spinner
- Error: inline alert with a helpful message (no technical leakage)

---

## 4) /auth/sign-up — requirements

### UI
- H1: `Create your account`
- Fields:
  - Email
  - Password
  - Confirm password
- Primary: `Create account`
- Secondary link: `Already have an account? Sign in` -> `/auth/sign-in` (preserve `returnTo`)

### Server endpoint (required)
Implement a registration endpoint:

- `app/api/auth/register/route.ts` (POST)

Request JSON:
```json
{ "email": "user@example.com", "password": "...." }
```

Rules:
- Validate input (zod if present, otherwise minimal validation)
- Lowercase + trim email
- Enforce password min length 8
- Enforce unique email (return 409 if already exists)
- Hash password with bcrypt
- Create the user via Prisma

Response:
- `{ ok: true }` or `{ ok: false, error: "..." }`

### Sign-up flow
- On submit, call `/api/auth/register`
- If ok → automatically sign in with credentials (same email/password) using `signIn(..., redirect:false)`
- Redirect to `returnTo ?? "/dashboard"`

Errors:
- Email already exists → show inline message and offer `Sign in` link

---

## 5) /auth/reset-password — requirements (minimal but real)

We need a usable reset flow that works in development even if email provider is missing.

### UX (two states on the same route)
**State A: Request reset link (default)**
- H1: `Reset your password`
- Field: Email
- Button: `Send reset link`
- Helper text: `We’ll email you a link to set a new password.`

**State B: Set new password (when token present)**
If URL contains `?token=...&email=...`:
- H1: `Set a new password`
- Fields: New password + Confirm new password
- Button: `Update password`

After success:
- Redirect to `/auth/sign-in` (preserve `returnTo` if present)

### Server endpoints (required)
Create two endpoints:

1) `app/api/auth/reset/request/route.ts` (POST)
Request:
```json
{ "email": "user@example.com" }
```
Behavior:
- If email does not exist: return `{ ok:true }` (do not leak user existence)
- Create a reset token record (see DB model below)
- Generate a reset link:
  `/auth/reset-password?email=...&token=...`
- Send email **if a mailer exists** in the project.
- If no mailer exists:
  - Log the reset link on the server (console)
  - Still return `{ ok:true }` with `devResetLink` ONLY in development (`process.env.NODE_ENV !== "production"`)

2) `app/api/auth/reset/confirm/route.ts` (POST)
Request:
```json
{ "email": "user@example.com", "token": "...", "password": "newPass" }
```
Behavior:
- Validate token exists + not expired + matches email
- Hash new password and update user password
- Delete token record after use
- Return `{ ok:true }`

### DB model (Prisma)
If the project already has a suitable token table, reuse it.
If not, add a small model:

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  @@index([email])
}
```

Run migration.

---

## 6) Shared UI components and styling
- Use existing `Card`, `Button`, `Input`, `Label`, `Alert` components from the project.
- Keep spacing consistent with Home (8pt grid).
- Add subtle hover lift for primary buttons if the project uses it (respect reduced motion).

---

## 7) Acceptance criteria (DoD)

### Functional
- `/auth/sign-in` works with Credentials provider
- `/auth/sign-up` creates a user (Prisma) and signs them in
- `/auth/reset-password` can request a link and set a new password using token flow
- `returnTo` is preserved and used across all flows

### UX
- Home-width container on all 3 pages
- Header/Footer match Home
- Inline success/error banners exist
- No em dashes in copy

### Security
- Reset request does not reveal if email exists
- Tokens expire (e.g., 30 minutes or 1 hour) and are single-use

---

## 8) Quick test plan (manual)
1) Visit `/auth/sign-in?returnTo=/generator`
   - Sign in → lands on `/generator`
2) Visit `/auth/sign-up?returnTo=/dashboard`
   - Create account → lands on `/dashboard`
3) Reset password:
   - Request link for existing email
   - Use token link → set new password
   - Sign in with new password succeeds

---

## 9) Keep the PR small
Do not implement guards, dashboard UI, or generator gating in this PR.
Only auth pages + register + reset endpoints + minimal token model/migration.
