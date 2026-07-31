# Planora AI — Website Build

## Status: Phase 6 (accounts + database) added on top of the complete site

All 20 requested pages are live: Home, Products hub + 9 product pages,
Apps (11 real shipped/in-progress apps), Projects (4 platform-scale
tools), Blog (real MDX), Research (real MDX), Docs + API reference,
Pricing, Marketplace, Templates, Courses, Consulting (booking form),
Community, Careers, About, Contact, Privacy, Terms.

**Commerce, fully wired:** Razorpay + Stripe checkout generalized across
three sellable kinds — subscription plans, marketplace items, and courses
— all resolved server-side via `lib/checkout-registry.ts` so a client can
never dictate its own price. Signature-verified webhooks for both
providers. A GST-aware invoice engine (CGST+SGST for Maharashtra buyers,
IGST otherwise — verified against manual GST math) with a live design
preview at `/invoice/demo`. Real `/api/contact` and `/api/consulting`
routes via Resend, both with a safe no-key fallback that logs
server-side instead of failing. See `.env.example` for the keys needed
to go live — every page works today without them; checkout simply
returns a clear "not configured yet" message instead of a live charge.

**47 routes total, all build-verified with zero TypeScript/ESLint errors**
(see build log below). Every list — products, blog, research, apps,
projects, marketplace, courses, pricing tiers — is driven by a single
`lib/*.ts` data file, so adding a new one anywhere is a one-file edit,
per your "everything reusable" requirement.

## What a real launch still needs (beyond this codebase)
This is a complete, correct frontend + commerce layer. A few things are
infrastructure, not code, and need real credentials/decisions from you:
1. **Accounts + a database** — right now payments work but nothing
   persists a "user" or activates their plan; that needs auth (e.g.
   Clerk/NextAuth) and a database (e.g. Postgres via Supabase/Neon).
2. **Live API keys** — Razorpay, Stripe, Resend — drop them into
   `.env.example` → `.env.local` (or your host's env settings).
3. **Real content** — the blog/research posts, app descriptions, and
   legal pages (Privacy/Terms) are written but should be reviewed;
   Privacy/Terms are explicitly marked as placeholder pending counsel
   review.
4. **Analytics** — Google Analytics + Search Console aren't wired in;
   that's a five-minute add once you have the property IDs.
5. **Deploy** — push to GitHub, import into Vercel, add the env vars
   above. `next build` is already verified clean.

## Run locally
```
npm install
npm run dev
```

## Design system
- Palette: ink-navy (#0A1420), blueprint-cyan (#1F5FA8), stamp-red
  (#B23A2E, used sparingly for critical CTAs), paper (#EDF0EA)
- Type: Space Grotesk (display), Inter (body), IBM Plex Mono (data/labels)
- Signature element: animated site-plan/blueprint drawing in the hero

## Notes
- Build was validated in the sandbox (`next build` compiles cleanly,
  zero type errors) with fonts temporarily stubbed, since this sandbox
  has no network access to fonts.googleapis.com. Real Google Fonts
  imports are restored in the delivered code — they'll resolve normally
  on Vercel or any environment with internet access.


## Phase 6 — Accounts, database, real invoice/plan activation

Added on top of the fully-shipped site above:

- **Auth**: NextAuth v4 — email magic link (sent via Resend, same graceful
  no-key fallback as the contact form) plus optional Google OAuth if
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set.
- **Database**: Prisma, SQLite by default (zero external setup — just
  `npm run db:push`). Swap one line in `prisma/schema.prisma`
  (`provider = "postgresql"`) to move to Supabase/Neon/RDS for
  production; nothing else changes.
- **Real fulfillment**: checkout now requires sign-in, and both webhooks
  (`/api/webhooks/razorpay`, `/api/webhooks/stripe`) call a shared
  `lib/fulfill-purchase.ts` that upserts the user, records a `Purchase`,
  generates and persists a real GST `Invoice`, and — for plan purchases —
  activates the plan on the account immediately.
- **`/account`**: sign in, see current plan, see purchase history, view
  each purchase's invoice.
- **`/invoice/[id]`**: the real, persisted invoice (ownership-checked —
  you can only view your own). `/invoice/demo` from Phase 4 is left in
  place as a static design reference.
- **Checkout registry** (`lib/checkout-registry.ts`) unchanged in shape,
  now also carries the signed-in user's email through to both providers'
  order/session metadata, which is how the webhook knows who to credit.

### Validation note — read this before assuming it's "tested"
Every other phase in this build was validated with a full, successful
`next build` in this sandbox. **This phase could not be**: Prisma's
`generate` step needs to download a query-engine binary from
`binaries.prisma.sh`, and that domain isn't reachable from this sandboxed
environment (network allowlist blocks it — confirmed by direct testing,
not assumed).

What I could still verify, and did:
- Every file compiles under `next build`'s full TypeScript + ESLint pass
  — including `app/account/page.tsx`, `app/invoice/[id]/page.tsx`, both
  webhook handlers, `lib/auth.ts`, `lib/fulfill-purchase.ts`, and the
  Prisma schema-derived types. The build gets all the way to page-data
  collection and fails at exactly one line: `new PrismaClient()` inside
  the generated client, because the engine binary is missing — not from
  a type or logic error anywhere in the code I wrote.
- The Prisma schema, NextAuth config, and adapter wiring follow the
  standard, documented pattern for this exact stack (NextAuth v4 +
  `@next-auth/prisma-adapter` + Prisma) — no invented APIs.

What this means for you: run `npm install && npm run db:push && npm run
dev` locally (or on Vercel) as the very first thing after unzipping this.
`db:push` needs real network access to fetch Prisma's engine, which your
machine will have and this sandbox didn't. If anything doesn't line up
once the engine can actually download, it'll surface immediately as a
normal Prisma error — tell me what it says and I'll fix it in the next
turn.

## Environment variables (updated)
See `.env.example` — now also needs `DATABASE_URL`, `NEXTAUTH_SECRET`,
`NEXTAUTH_URL`, and optionally `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.

## What a real launch still needs (updated)
1. ~~Accounts + a database~~ — done this phase.
2. Live API keys (Razorpay, Stripe, Resend, Google OAuth if wanted).
3. Real content review + counsel review on Privacy/Terms.
4. Analytics (Google Analytics + Search Console).
5. Deploy to Vercel + add a **Postgres** database for production (SQLite
   is fine for local dev, not for a deployed app on Vercel's ephemeral
   filesystem).

## Phase 7 — SEO/social polish

- Google Analytics (GA4) — loads only if `NEXT_PUBLIC_GA_ID` is set, zero
  impact otherwise (`components/analytics/GoogleAnalytics.tsx`)
- Google Search Console verification — set `GOOGLE_SITE_VERIFICATION` and
  it's injected into page metadata automatically
- On-brand auto-generated favicon (`app/icon.tsx`) and Open Graph/Twitter
  share image (`app/opengraph-image.tsx`) — no static image files to
  forget to upload, they're generated from code at build time

---

# Deploy: exact steps, in order

1. **Unzip and install**
   ```
   cd planora-ai
   npm install
   ```
   This also runs `prisma generate` automatically (via `postinstall`) —
   needs normal internet access, which your machine has and the sandbox
   that built this didn't.

2. **Set up the database (local dev, SQLite — zero config)**
   ```
   cp .env.example .env.local
   npm run db:push
   ```
   `.env.local`'s default `DATABASE_URL="file:./dev.db"` just works.

3. **Run it locally**
   ```
   npm run dev
   ```
   Open `http://localhost:3000`. Sign in at `/account` with any email —
   without `RESEND_API_KEY` set, the magic link prints to your terminal
   instead of sending an email, so you can still test the full flow.

4. **Push to GitHub**
   ```
   git init
   git add .
   git commit -m "Planora AI website"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

5. **Deploy to Vercel**
   - Import the repo at vercel.com/new
   - Framework preset: Next.js (auto-detected)
   - Add environment variables (Project Settings → Environment Variables):
     - `DATABASE_URL` — **use Postgres here**, not SQLite (Vercel's
       filesystem is ephemeral). Easiest: add the Vercel Postgres or
       Supabase/Neon integration, copy the connection string, and change
       `provider = "sqlite"` to `provider = "postgresql"` in
       `prisma/schema.prisma` before this deploy.
     - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
     - `NEXTAUTH_URL` — your production URL, e.g. `https://planora.ai`
     - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
     - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
     - `RESEND_API_KEY` (optional but recommended — otherwise contact
       form and magic links only log server-side, they don't send)
     - `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION` (optional)
   - Deploy.

6. **After first deploy, run the DB migration against production**
   ```
   DATABASE_URL="<your-production-url>" npx prisma db push
   ```
   (Run this from your machine, once, pointed at the production database.)

7. **Wire the payment webhooks** (do this after step 5, once you have a
   live URL):
   - Razorpay Dashboard → Settings → Webhooks → add
     `https://yourdomain.com/api/webhooks/razorpay`, subscribe to
     `payment.captured`, copy the signing secret into
     `RAZORPAY_WEBHOOK_SECRET`.
   - Stripe Dashboard → Developers → Webhooks → add
     `https://yourdomain.com/api/webhooks/stripe`, subscribe to
     `checkout.session.completed`, copy the signing secret into
     `STRIPE_WEBHOOK_SECRET`.
   - Redeploy after adding these two secrets.

8. **Point your domain at Vercel** (Project Settings → Domains), then
   submit `https://yourdomain.com/sitemap.xml` in Google Search Console.

9. **Test one real end-to-end purchase** on the Pro plan with a small
   amount / test-mode keys before going fully live, and confirm the
   invoice shows up under `/account`.

That's the whole path from this zip to a live, revenue-collecting site.
