---
name: coding-standards
description: Apply repo-specific production standards for michaelzick.com Next.js, React, TypeScript, API routes, forms, analytics, SEO, security, and tests. Use before implementation, refactors, API route work, UI state changes, styling work, error handling, analytics changes, security-sensitive code, tests, and code reviews.
---

# Coding Standards

## Purpose

This guide defines production standards for `michaelzick.com`: a Next.js App Router coaching website with conversion-critical forms, AI analysis, email delivery, analytics, blog content, SEO metadata, and mobile-heavy UI. Use it to keep changes clear, secure, testable, accessible, and consistent with the existing brand experience.

## Core principles

- Prefer predictable behavior over clever implementation. A future maintainer should understand a change from the route/component location, names, and tests.
- Keep boundaries explicit: pages compose UI, components render interactions, `lib/*` holds reusable pure/client-safe helpers, `lib/server/*` holds server-only validation/config helpers, and `app/api/*` performs request/response orchestration.
- Treat public form input as hostile. Normalize, validate, rate-limit, captcha-check, and avoid logging sensitive content.
- Preserve conversion paths. Contact, questionnaire, booking CTAs, NGU coupon signup, nav, and blog routes should remain fast, accessible, mobile-safe, and tracked.
- Keep SEO facts synchronized with page/content changes: metadata, structured data, sitemap generation, canonical URLs, and image alt text.

## Next.js and React

- Default to server components for static content and metadata. Add `"use client"` only where browser APIs, React state, effects, or event handlers are required.
- Do not import server-only modules (`nodemailer`, OpenAI client construction, secret env access, `lib/server/*`) into client components.
- Keep route handlers thin: parse JSON, normalize/validate, enforce limits/security checks, call integrations, and return stable JSON.
- Use `runtime = 'nodejs'` for routes requiring Node APIs such as Nodemailer or OpenAI SDK behavior.
- Keep effects cleanup-safe. Remove listeners, clear timers, unlock body scroll, and guard browser storage access with `try/catch` where private mode can throw.
- Use semantic HTML first: real links for navigation/CTAs, real buttons for actions, labels for inputs, keyboard support, visible focus states, and useful `aria-label` text when visible text is insufficient.

## TypeScript

- The repo currently has `strict: false`; new code should still be narrow and explicit. Avoid `any`; use `unknown` at trust boundaries and validate before access.
- Export stable, small types only when another module needs them. Keep local implementation types local.
- Model async/UI states explicitly when a component has loading, success, error, empty, or retry behavior.
- Keep casts close to validation boundaries and make them narrow. Do not use broad casts to silence unknown data from requests, JSON content, analytics globals, or external APIs.

## API routes, validation, and integrations

- Validate request bodies before using fields. Public write routes should reject missing, malformed, oversized, or unexpected payloads with `400`.
- Keep rate limits on public write routes. Reuse `lib/server/rate-limit.ts` patterns unless a durable external rate limiter is intentionally introduced.
- Verify Invisible reCAPTCHA v2 server-side before sending email or coupon responses. Do not replace this flow with reCAPTCHA Enterprise unless the whole app is intentionally migrated.
- Do not leak secrets, stack traces, provider internals, or full user submissions in JSON responses or logs.
- Keep email construction in helper functions where it can be unit-tested. Route handlers should not accumulate large inline templates when helpers already exist.
- OpenAI prompts should avoid exposing unnecessary personal data, keep bounded output expectations, and handle provider/model failures with a clear user-facing fallback.
- Outbound dependency failures should return controlled responses and log enough context to debug without recording credentials or complete private messages.

## Analytics and SEO

- Track links and CTA clicks through `TrackedLink`, `TrackedCtaLink`, or `lib/analytics.ts` so GA4 and Amplitude stay aligned.
- Keep analytics payloads stable and privacy-aware. Do not send free-form questionnaire answers, full contact messages, captcha tokens, SMTP data, or secrets.
- Update `lib/site.ts`, metadata, structured data helpers, and sitemap generation when public page structure or brand facts change.
- Blog changes should preserve slug normalization, duplicate-slug handling, excerpts, canonical URLs, dates, tags, and structured data tests.
- Regenerate `public/sitemap.xml` with `npm run sitemap` after durable route/blog URL changes.

## Styling and UI

- Match nearby Tailwind patterns and the existing premium coaching brand. Avoid one-off style systems, unrelated component libraries, or broad visual rewrites.
- Design mobile first for nav, hero, forms, CTA bands, NGU promo, and blog filters. Text must not overlap, clip, or require horizontal scrolling.
- Use responsive constraints, stable dimensions, and sensible line lengths for cards, buttons, modal content, and fixed/sticky UI.
- Keep form errors visible, specific, and actionable. Disabled/loading states should prevent duplicate submission without trapping the user.
- Public images should have meaningful alt text when informative and empty alt text only when decorative.

## Testing

- Unit-test pure helpers in `tests/*.test.ts` with Node's built-in test runner.
- Add or update Playwright tests for routed UI behavior, mobile layout, modal/dialog flows, reCAPTCHA execution, and conversion-critical form behavior.
- Mock network providers at the route/page boundary in tests. Do not call real OpenAI, Google reCAPTCHA, Brevo SMTP, GA4, or Amplitude from tests.
- Run `npm run lint`, `npm run typecheck`, and the relevant tests before marking work done. For PR-ready changes, run `npm run check`; include `npm run test:e2e` when UI behavior changed.

## Review checklist

- Client/server boundaries are correct and no secret-bearing module leaks into the browser bundle.
- Public inputs are normalized, validated, rate-limited, and captcha-checked where appropriate.
- Errors have controlled user-facing responses and useful sanitized logs.
- Analytics events are centralized and do not include sensitive free-form data.
- SEO metadata, structured data, sitemap behavior, and canonical URLs remain correct.
- Mobile layouts, focus behavior, form states, and dialogs are accessible.
- Tests cover the changed behavior and important failure modes.
