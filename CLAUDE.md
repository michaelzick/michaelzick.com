# Michael Zick — Agent Orientation (Claude Code)

This document is the canonical project brief for AI coding agents. Read it at the start of every session instead of re-exploring the repo. Keep it current: see [Maintaining this file](#maintaining-this-file).

Sibling files [AGENTS.md](AGENTS.md) (Codex) and [GEMINI.md](GEMINI.md) (Gemini CLI) mirror this content for other harnesses. Update all three together when code structure changes.

---

## 1. Project overview

**michaelzick.com** is Michael Zick's coaching website and conversion platform for Nice Guy Recovery / Reality Alignment coaching. It combines static marketing pages, a blog, lead-capture forms, an AI-assisted questionnaire, analytics instrumentation, and Nice Guy University promotion flows.

Primary flows:
- Visitors learn about Michael's coaching model through the home, about, testimonials, contact, and Nice Guy University pages.
- Visitors submit a multi-step questionnaire and receive an OpenAI-generated coaching analysis.
- Contact and NGU coupon forms validate Invisible reCAPTCHA v2, rate-limit submissions, send Brevo SMTP email notifications, and sync newsletter opt-ins to HubSpot as male subscribers.
- Blog readers browse JSON-backed posts with category/tag filters and structured data for SEO.
- CTA and navigation interactions are tracked through a shared analytics wrapper for GA4 and Mixpanel.

## 2. Tech stack

- **Framework:** Next.js 16 App Router with React 19 and TypeScript; the package is currently pinned to the patched 16.3 canary line until the same security fixes land in a stable release.
- **Styling:** Tailwind CSS 3, global styles in `app/globals.css`, image assets in `public/img/`.
- **Server routes:** Next route handlers under `app/api/*`, using Node runtime where email/OpenAI APIs are needed.
- **AI, email, and CRM:** OpenAI Node SDK for questionnaire analysis; Nodemailer with Brevo SMTP for notifications; HubSpot CRM API for newsletter subscriber sync.
- **Bot protection:** Classic Invisible reCAPTCHA v2 via `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2` and `RECAPTCHA_SECRET_KEY_V2`.
- **Analytics:** GA4 and Mixpanel scripts in `components/SiteAnalyticsScripts.tsx` (Mixpanel autocapture, session replay, and heatmaps; page text visible, inputs masked); tracked events in `lib/analytics.ts`. Mixpanel is consent-gated by a cookie banner: opt-out by default outside the EU/EEA/UK, opt-in within (timezone heuristic); GA4 is not gated.
- **Testing:** Node's built-in test runner for compiled unit tests, TypeScript test build via `tsconfig.test.json`, and Playwright for E2E/mobile UI checks.
- **Tooling:** npm with `package-lock.json`, Node 24 LTS, ESLint flat config via `eslint-config-next/core-web-vitals`.

## 3. Repository layout

```
michaelzick.com/
├── app/                 # Next App Router pages, layout, metadata, API routes, sitemap/robots
├── components/          # React UI components, navigation, sections, blog, questionnaire, hooks
├── content/blog/        # JSON-backed blog content fixtures and production posts
├── lib/                 # Analytics, blog utilities, structured data, server validation/helpers
├── public/              # Favicons, manifest, generated sitemap, static image assets
├── scripts/             # Node scripts such as sitemap generation
├── skills/              # Repo-local agent skills
├── tests/               # Node unit tests and Playwright E2E tests
├── types/               # Ambient type declarations
├── .github/workflows/   # CI and security automation
├── package.json         # npm scripts and dependency list
└── package-lock.json    # npm lockfile; keep npm workflow
```

## 4. Application structure

### 4.1 App Router pages

- `app/layout.tsx` defines global metadata, JSON-LD, analytics scripts, nav, NGU promo, footer, and Open Sans.
- `app/page.tsx` renders the home page through `components/HomePageContent.tsx`.
- `app/about/page.tsx`, `app/testimonials/page.tsx`, and `app/contact/page.tsx` are static marketing/conversion pages.
- `app/privacy-policy/page.tsx` and `app/terms-of-service/page.tsx` are static legal pages; the privacy policy documents the analytics/consent model and must stay accurate when analytics or form integrations change.
- `app/contact/ContactContent.tsx` provides the contact page client experience.
- `app/questionnaire/page.tsx` renders the questionnaire flow.
- `app/nice-guy-university/page.tsx` renders the NGU promotional page and outbound CTAs.
- `app/blog/page.tsx` and `app/blog/[slug]/page.tsx` render blog index/detail pages with structured data.
- `app/sitemap.ts` and `app/robots.ts` expose Next-generated SEO metadata routes.

### 4.2 API routes

- `app/api/analyze/route.ts` accepts questionnaire submissions, applies honeypot/rate limiting/length checks, calls OpenAI (`gpt-5-mini` with fallback to `gpt-4o-mini`), and optionally emails the result via Brevo SMTP.
- `app/api/contact/route.ts` validates contact submissions, enforces per-IP rate limits, verifies Invisible reCAPTCHA v2, sends contact email via Brevo, and best-effort syncs HubSpot when the workbook/newsletter opt-in is selected.
- `app/api/ngu-coupon/route.ts` validates NGU coupon signups, verifies reCAPTCHA, sends the visitor coupon email, sends the internal notification email, and best-effort syncs the email to HubSpot.
- Shared server helpers live in `lib/server/`: contact and NGU normalization/validation/email builders, HubSpot subscriber sync, OpenAI client construction, and in-memory rate limiting.

### 4.3 Components and client behavior

- `components/navigation/` contains desktop/mobile navigation primitives used by `components/NavBar.tsx`.
- `components/sections/` contains major home-page content bands; keep visual changes consistent with the existing premium coaching brand.
- `components/questionnaire/` contains the questionnaire steps, fields, form, and analysis rendering.
- `components/blog/` contains blog filters, cards, hero, breadcrumbs, similar posts, and scroll-to-top behavior.
- `components/ContactForm.tsx` and `components/NguCouponSignupForm.tsx` load and execute Invisible reCAPTCHA v2 before posting to API routes.
- `components/TrackedLink.tsx` and `components/TrackedCtaLink.tsx` centralize CTA/link tracking.
- `components/CookieConsentBanner.tsx` renders the analytics consent banner (reopenable from the footer); `lib/cookie-consent.ts` stores the choice and gates Mixpanel loading and opt-out.
- `components/hooks/` contains UI hooks for scroll tracking, fade-in behavior, and title visibility.

### 4.4 Content, SEO, and analytics

- Blog source content lives in `content/blog/posts.json`; `lib/blog.ts` normalizes slugs, excerpts, filters, dates, and similar posts.
- Site-wide brand/SEO constants live in `lib/site.ts`.
- Structured data helpers live in `lib/site-structured-data.ts` and `lib/blog-structured-data.ts`.
- `scripts/generate-sitemap.js` writes `public/sitemap.xml`; use `SITE_URL` to override the production base URL.
- Analytics scripts are hardcoded in `components/SiteAnalyticsScripts.tsx`; event dispatch lives in `lib/analytics.ts`. The Mixpanel bootstrap there duplicates the consent key/version and EU timezone heuristic from `lib/cookie-consent.ts` — keep them in sync.

## 5. Environment

No committed `.env.example` currently exists. Environment variables used by the app:

- `OPENAI_API_KEY` — required for questionnaire analysis.
- `BREVO_SMTP_PASSWORD`, `BREVO_USER`, `BREVO_TO`, `BREVO_FROM` — required for contact and NGU email routes; optional for questionnaire result notification.
- `HUBSPOT_SERVICE_KEY` — preferred HubSpot Private App bearer token for newsletter subscriber sync.
- `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_PRIVATE_APP_TOKEN` — legacy HubSpot token fallbacks when `HUBSPOT_SERVICE_KEY` is not set.
- `HUBSPOT_CONTACT_OWNER_ID` — required HubSpot owner ID for newsletter subscriber contacts and notes.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2` — public Invisible reCAPTCHA v2 site key used by browser forms.
- `RECAPTCHA_SECRET_KEY_V2` — server-side Invisible reCAPTCHA v2 secret used with Google `siteverify`.
- `SITE_URL` — optional sitemap generation override; defaults to `https://www.michaelzick.com`.
- `PORT` — used by `npm start` and Playwright web server startup.
- `CI` and `PLAYWRIGHT_SKIP_BUILD` — influence Playwright server reuse/build behavior.

Do not commit `.env`, API keys, SMTP credentials, reCAPTCHA secrets, Vercel secrets, or production form exports.

## 6. Commands

```bash
npm run dev                 # Next dev server
npm run build               # Production Next build
npm start                   # Start built Next app on $PORT
npm run lint                # ESLint / Next core web vitals
npm run typecheck           # tsc --noEmit
npm test                    # Compile test TS, run node --test, clean .test-dist
npm run test:e2e            # Playwright E2E/mobile UI tests
npm run sitemap             # Regenerate public/sitemap.xml
npm run agent-briefs:sync   # Regenerate CLAUDE.md and GEMINI.md from AGENTS.md
npm run agent-briefs:check  # Fail if CLAUDE.md or GEMINI.md drift from AGENTS.md
npm run check               # Agent brief check + lint + typecheck + unit tests + build
```

CI runs the brief sync check, lint, typecheck, unit tests, production build, and Playwright Chromium E2E tests on the latest Node 24 patch. The security workflow runs Gitleaks, `npm audit --audit-level=moderate`, pull request dependency review via GitHub's Dependency Review API, and CodeQL.

## 7. Conventions and coding standards

- **Coding standards:** use `skills/coding-standards/SKILL.md` before implementation, refactors, API route work, UI state changes, security-sensitive code, analytics changes, and tests.
- **Package manager:** use npm and keep `package-lock.json`; do not introduce pnpm/yarn lockfiles.
- **Node version:** use Node 24, matching `.nvmrc`, `package.json#engines`, and GitHub Actions.
- **TypeScript:** the project is not yet strict (`strict: false`); keep new code strongly typed and avoid spreading `any` further.
- **Next boundaries:** keep browser-only code behind client components/hooks and server-only APIs in route handlers or `lib/server/*`.
- **API routes:** validate untrusted request bodies before use, enforce rate limits on public write routes, avoid logging secrets or full sensitive submissions, and return stable JSON errors.
- **Forms:** contact and NGU submissions must keep Invisible reCAPTCHA v2 verification and accessible failure states.
- **Analytics:** send events through `lib/analytics.ts` or tracked link components so GA4 and Mixpanel payloads stay aligned.
- **SEO:** update metadata, structured data, sitemap generation, and canonical URLs when adding durable public pages or blog behavior.
- **Styling:** use Tailwind utility patterns already present in nearby components; keep pages responsive and verify mobile layouts when touching nav, hero, forms, CTAs, or promotional modals.
- **Testing:** unit-test pure helpers in `tests/*.test.ts`; use Playwright for routed UI behavior, mobile layout, reCAPTCHA flow mocks, and conversion-critical interactions.
- **Completion gate:** before marking meaningful work done, run `npm run lint`, `npm run typecheck`, and relevant tests. For PR-ready changes, run `npm run check`; add E2E when UI behavior changed.

## 8. Key files map

| Path | What lives here |
|---|---|
| [app/layout.tsx](app/layout.tsx) | Root metadata, scripts, global shell, nav, NGU promo, footer |
| [app/page.tsx](app/page.tsx) | Home route wrapper |
| [components/HomePageContent.tsx](components/HomePageContent.tsx) | Home page composition |
| [components/NavBar.tsx](components/NavBar.tsx) | Site navigation shell |
| [components/NguPromo.tsx](components/NguPromo.tsx) | Timed NGU promotion modal/banner behavior |
| [components/ContactForm.tsx](components/ContactForm.tsx) | Contact form client UX and reCAPTCHA execution |
| [components/NguCouponSignupForm.tsx](components/NguCouponSignupForm.tsx) | NGU coupon signup client UX |
| [components/questionnaire/QuestionnaireForm.tsx](components/questionnaire/QuestionnaireForm.tsx) | Questionnaire form state and submission |
| [components/questionnaire/steps.ts](components/questionnaire/steps.ts) | Questionnaire question definitions |
| [app/api/analyze/route.ts](app/api/analyze/route.ts) | OpenAI questionnaire analysis route |
| [app/api/contact/route.ts](app/api/contact/route.ts) | Contact email + reCAPTCHA route |
| [app/api/ngu-coupon/route.ts](app/api/ngu-coupon/route.ts) | NGU coupon email + reCAPTCHA route |
| [lib/server/contact.ts](lib/server/contact.ts) | Contact normalization, validation, config, email text |
| [lib/server/hubspot-subscriber.ts](lib/server/hubspot-subscriber.ts) | HubSpot CRM contact upsert and subscriber note sync |
| [lib/server/ngu-coupon.ts](lib/server/ngu-coupon.ts) | NGU coupon normalization, validation, config, email text |
| [lib/server/rate-limit.ts](lib/server/rate-limit.ts) | In-memory rate limiting helpers |
| [lib/blog.ts](lib/blog.ts) | Blog post normalization and filters |
| [lib/site.ts](lib/site.ts) | Site and brand constants |
| [lib/analytics.ts](lib/analytics.ts) | GA4/Mixpanel event helpers |
| [lib/cookie-consent.ts](lib/cookie-consent.ts) | Analytics consent storage, EU heuristic, Mixpanel gating |
| [components/CookieConsentBanner.tsx](components/CookieConsentBanner.tsx) | Cookie consent banner UI |
| [scripts/generate-sitemap.js](scripts/generate-sitemap.js) | Static sitemap generation |
| [playwright.config.ts](playwright.config.ts) | Playwright web server and reporter configuration |
| [skills/coding-standards/SKILL.md](skills/coding-standards/SKILL.md) | Repo-local production coding standards |
| [skills/sync-agent-briefs/SKILL.md](skills/sync-agent-briefs/SKILL.md) | Workflow for syncing agent orientation files |

---

## Maintaining this file

**Whenever durable project facts change, update `AGENTS.md` in the same change.** Examples that require an update:

- Adding, removing, renaming, or re-homing a route, API route, component group, content source, test category, or script.
- Changing form submission behavior, analytics conventions, SEO/structured-data behavior, reCAPTCHA/email/OpenAI integrations, or security posture.
- Changing root `package.json` scripts, CI/security workflows, Node version, environment variables, or completion workflow.
- Changing a file listed in [Key files map](#8-key-files-map), or adding something that belongs in it.

Treat `AGENTS.md` as the canonical source for mirrored harness briefs. After updating it, run `npm run agent-briefs:sync` and `npm run agent-briefs:check` so [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) stay aligned.

Do **not** use this file for ephemeral notes, in-flight TODOs, debugging logs, or session state. It is a map, not a journal.
