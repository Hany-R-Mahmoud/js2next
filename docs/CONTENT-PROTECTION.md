# JS2Next content protection

The application uses a default-deny content boundary while keeping public signup enabled:

- `CONTENT_ACCESS_MODE=closed` serves no full lesson, practice, quiz, or assessment content.
- `CONTENT_ACCESS_MODE=preview` is for local or Vercel-protected editorial preview only.
- `CONTENT_ACCESS_MODE=members` requires a Supabase-authenticated user whose email is verified.
- A verified user receives immediate access; a row in `public.members` is not required.
- `public.members` is an optional admin-control table for revocation, expiry, and temporary locks.
- Only `published` plus `approved` content may pass the member runtime boundary.
- Public routes expose the curriculum catalog only. Lesson URLs are noindex and are absent from the sitemap.
- Search, workspace routes, practice scoring, and assessment scoring are member-only and use private no-store responses.

## Required authentication model

Configure Supabase Auth as follows:

- Allow new users to sign up: **ON**.
- Email provider: **ON**.
- Confirm email / email verification: **ON**.
- Administrator approval: **OFF**; verified users are not placed in a manual approval queue.
- Passwordless email / magic link: **ON**.
- The application uses `shouldCreateUser: true`, allowing the same form to create a user or sign in an existing user.

The intended flow is:

`submit email → receive email → verify email → follow magic link → immediate member access`

The server verifies the session and the fresh Supabase user record, including `email_confirmed_at`. It then applies any optional `public.members` override. This means email verification is the onboarding gate; `public.members` is not an allowlist.

## Operator setup

1. In Supabase Auth, enable public signup, email verification, and magic-link email. Do not enable administrator approval.
2. Configure Resend as the Supabase custom SMTP provider. Authenticate the sending domain before production mail is enabled.
3. Add the production and local `/auth/confirm` URLs to Supabase Auth redirect URLs.
4. Create or reuse a Cloudflare Turnstile widget, add the production hostname, and add its public site key as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Vercel and local development. Keep the Turnstile secret only in Supabase.
5. In Supabase Project Settings → Authentication → Bot and Abuse Protection, enable CAPTCHA protection, select Cloudflare Turnstile, and save the secret key. The client passes the challenge token to `signInWithOtp`.
6. Apply `supabase/migrations/202607230001_content_protection.sql`, then `supabase/migrations/202607230002_verified_user_access.sql`.
7. Add the Supabase URL and publishable key to Vercel Production and Preview environment variables. Never expose a service-role key to the browser or repository.
8. Set `CONTENT_ACCESS_MODE=members` only after the release manifest is generated and human-approved. Set `CONTENT_PRODUCTION_MANIFEST` to that artifact during the build.
9. Use `public.members` only for administrative exceptions. Example controls are `status = 'revoked'`, a future `expires_at`, or a future `locked_until`. Changes must be made by an administrator through a protected server-side workflow or Supabase dashboard; normal authenticated clients have no insert, update, or delete policy on this table.
10. Turn on Vercel Deployment Protection / Vercel Authentication for Preview deployments. This is required when `CONTENT_ACCESS_MODE=preview` is used outside a local machine.
11. Configure Vercel WAF rate limits for `/api/member/*`, `/auth/*`, and sign-in traffic. Suggested starting limits are 10 sign-in attempts per IP per 10 minutes and 30 assessment/practice submissions per user per minute, then tune from telemetry.
12. Review Supabase Auth rate limits, CAPTCHA failures, sign-up bursts, magic-link delivery, and audit logs weekly. Alert on repeated failures by IP, email domain, user ID, and route.

## RLS and admin boundary

The second migration creates `public.is_verified_user()`, which checks `auth.users.email_confirmed_at` server-side. RLS permits verified users to read their own membership metadata and assessment attempts and to insert attempts owned by their own user ID. It does not permit clients to mutate `public.members`; admin actions remain outside the browser client.

Application authorization remains in place as defense in depth: content must be published and approved, the session must be verified, and any membership override must be valid.

## Verification gates

Run `npm run validate:production-content`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before enabling members mode. Then test the real flow with a new email address:

1. Submit an unregistered email and complete CAPTCHA.
2. Confirm Supabase creates the user but does not grant access before email confirmation.
3. Confirm the email and follow the magic link.
4. Confirm the user opens approved member content immediately without a `public.members` row.
5. Confirm a revoked, expired, or locked override blocks access.
6. Confirm anonymous requests receive a redirect or 404 for protected routes, protected responses contain `private, no-store`, and browser payloads do not contain `correctChoiceIds` or choice feedback before submission.

## Residual risks

No browser-delivered content can be made impossible to copy after a verified user can read it. This implementation reduces anonymous scraping and bulk cloning by moving access checks and scoring server-side, requiring email verification and CAPTCHA, removing machine-readable full-content routes, limiting caching, and keeping release approval explicit. Authorized-user misuse still requires watermarking, account-level telemetry, WAF controls, and operational revocation.
