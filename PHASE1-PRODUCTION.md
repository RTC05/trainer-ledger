# Phase 1 Public Launch

This phase makes PokéDex Tracker feel like a public website without forcing a risky platform rewrite.

## Goals

- Add a public-facing homepage
- Add a support/donate page
- Keep donation links environment-driven
- Prepare for the next production step: PostgreSQL

## Environment Variables

Set these in Railway for the public/support pages:

- `PUBLIC_BASE_URL`
  - Example: `https://your-domain.com`
- `SUPPORT_EMAIL`
  - Example: `hello@your-domain.com`
- `PATREON_URL`
  - Example: `https://www.patreon.com/cw/RTC05`
- `STRIPE_DONATE_URL`
  - Hosted Stripe Payment Link for one-time support
- `STRIPE_MONTHLY_URL`
  - Hosted Stripe Payment Link for recurring support

If the Stripe URLs are not set, the support page still renders and Patreon can carry the support flow on its own.

## Recommended Support Setup

Start with Patreon if that is your main fan-support home.

- Patreon for community and recurring support
- Stripe Payment Links later if you want one-time donations too

If you add Stripe too, use hosted Stripe Payment Links for Phase 1:

- One-time donation link
- Monthly support link

This avoids storing billing state in the app before the public site is fully hardened.

## Railway Rollout

1. Set the environment variables above
2. Redeploy the app
3. Check:
   - `/`
   - `/support`
   - `/updates`
   - `/health`

## Phase 2 Recommendation

Phase 2 should focus on the database and account layer:

- Move from SQLite to PostgreSQL
- Add password reset/email verification
- Add moderation/admin workflow for reports and suggestions
- Add backups and stronger production monitoring

## SMTP Email Setup

To enable real password reset emails, set these in Railway:

- `SMTP_HOST`
  - Example: `smtp.gmail.com`
- `SMTP_PORT`
  - Example: `587`
- `SMTP_USERNAME`
  - Your SMTP login
- `SMTP_PASSWORD`
  - Your SMTP password or app password
- `SMTP_FROM_EMAIL`
  - Example: `hello@trainerledger.com`
- `SMTP_FROM_NAME`
  - Example: `Trainer Ledger`
- `SMTP_USE_STARTTLS`
  - Usually `true`
- `SMTP_USE_SSL`
  - Usually `false`

If SMTP is not configured yet, password reset still works in work-in-progress mode by showing the reset link on the page instead of sending it by email.
