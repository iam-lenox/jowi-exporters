# Plan — Role-based access + admin subdomain

## 1. One database, two roles (already in place — verify & harden)
Your Supabase project already has the right structure:
- `user_roles` table with an `app_role` enum (`admin`, `client`)
- `has_role()` security-definer function for RLS
- `handle_new_user()` trigger that auto-assigns `client` on signup, and `admin` only when the email is `jowiexporterslimited@gmail.com`
- RLS policies on `shipments`, `tracking_events`, `profiles`, `contact_messages` already scope client reads to their own rows and give admins full access

Action: I will audit every policy and confirm that no client can read another client's data or any admin-only data, and confirm the `handle_new_user` trigger is actually attached to `auth.users` (it's defined but the schema dump shows no triggers — likely the reason new signups may not get a role row).

## 2. Hide admin UI from clients (frontend)
Currently `src/components/site/header.tsx` already conditionally renders the Admin button only when `isAdmin` is true, and the Track Shipment button only when logged in. I will:
- Double-check `useIsAdmin` returns `false` (not `undefined`) before render to prevent any flash of the Admin link for clients on slow networks
- Make the `/admin` route reject non-admins server-side via the existing `_authenticated` guard plus a role check that redirects to `/dashboard` immediately (no toast flash of admin chrome)
- Ensure the mobile menu mirrors the same role logic (it currently may not)

## 3. Admin subdomain (`admin.jowiexporterslimited.com`)
Two clean ways to do this — I recommend **Option A**:

- **Option A (recommended): one app, subdomain routes to `/admin`.** Same codebase, same deploy. A tiny redirect in `__root.tsx` says: "if hostname starts with `admin.` and user is on `/`, send them to `/admin`; if hostname is the root domain and user lands on `/admin`, send them to `admin.` subdomain." Clients on the root domain never even see the admin URL exists. One deploy, one DB, zero duplication.
- **Option B:** two separate Lovable projects sharing the Supabase DB. More moving parts, two deploys, two sets of env vars. Only worth it if you want totally different UIs.

I'll implement Option A unless you prefer B.

## 4. Domain + subdomain purchase
After the code is ready you'll:
1. Open **Project Settings → Domains → Buy new domain** and purchase `jowiexporterslimited.com` directly in Lovable
2. Add `admin.jowiexporterslimited.com` as a second connected domain on the same project
3. Both point to the same deployment; the subdomain routing logic in step 3 handles the rest

I'll guide you through these clicks when we get there — nothing to code for the purchase itself.

## 5. Out of scope for this plan
- No database wipe (you asked for a clean slate earlier; say the word if you want it again)
- No new features on the admin page itself
- No password/auth UX changes

## Technical details
- Subdomain detection uses `window.location.hostname` in a small client-side effect in `__root.tsx`; SSR-safe via `typeof window` guard
- Role check on `/admin` uses `useIsAdmin` (already wired to `has_role` RPC) and redirects to `/dashboard` before any admin component mounts
- No schema changes needed unless the audit in step 1 finds the `on_auth_user_created` trigger is actually missing — then one small migration to recreate it

Confirm Option A vs B and I'll switch to build mode.
