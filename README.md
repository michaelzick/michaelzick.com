# Michael Zick | Reality Alignment Coach

A premium, high-performance coaching website and alignment platform designed by **Michael Zick** and built using **AI-Driven Development**. This project showcases a modern approach to software engineering, blending strategic product management, user-centric design, and cutting-edge development workflows.

## 🚀 The Vision

This platform serves as the digital home for Michael Zick's "Reality Alignment" coaching. It is designed to be as direct and effective as his coaching style—no fluff, just results.

### Core Features
- **Reality Alignment Questionnaire**: A multi-step diagnostic tool that uses AI (OpenAI GPT-4o-mini / GPT-5-mini) to analyze user struggles and provide personalized coaching insights.
- **Dynamic Content Platform**: A full-featured blog ecosystem with category filtering and tag-based navigation.
- **Integrated Conversion Funnels**: Seamless booking integration via Calendly and a custom-built contact system.
- **Automated Insights**: Questionnaire results are automatically analyzed by AI and securely routed to Michael for lead generation and client onboarding.

## 🛠️ Technical Excellence

Built with a focus on speed, accessibility, and maintainability.

- **Framework**: [Next.js](https://nextjs.org/) (App Router) for superior performance and SEO.
- **Language**: [TypeScript](https://www.typescript.org/) ensuring 100% type safety across the application.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a bespoke, responsive design system.
- **AI Integration**: [OpenAI API](https://openai.com/api/) powering the "Reality Alignment" diagnostic engine.
- **Infrastructure**: [Brevo SMTP](https://www.brevo.com/) for reliable transactional email delivery.

## 📊 Analytics & Growth

The site is engineered for data-driven growth, featuring a unified analytics implementation:

- **Google Analytics 4 (GA4)**: Tracking high-level traffic patterns and user acquisition.
- **Amplitude**: Deep event-level tracking to analyze user behavior within the questionnaire and conversion funnels.
- **Custom Event Engine**: A centralized `analytics.ts` library ensures consistent event schema across GA4 and Amplitude, tracking everything from CTA clicks to questionnaire completions.

## 🧠 AI-Driven Development (AIDD)

This project represents the cutting edge of modern development. Michael Zick served as the **Product Manager and Lead Designer**, while the application was built using advanced AI-driven workflows. This allowed for:
- **Rapid Prototyping**: Moving from concept to a functional AI-powered questionnaire in record time.
- **Clean Architecture**: Ensuring robust code quality and type-safety through AI-assisted refactoring.
- **UX Precision**: Iterating on design systems and spacing to match Michael's exacting standards for a premium brand experience.

## 🛠️ Performance & Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run the unit test suite
npm test
```

## Contact Form reCAPTCHA Setup

The contact form uses classic **reCAPTCHA v3**, not reCAPTCHA Enterprise.

- Browser token generation uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- Server-side verification uses `RECAPTCHA_SECRET_KEY` and Google `siteverify`.
- This setup does **not** use Google Cloud ADC, `gcloud auth application-default login`, service accounts, or reCAPTCHA Enterprise client libraries.

Required local and deployment environment variables:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_v3_site_key
RECAPTCHA_SECRET_KEY=your_v3_secret_key
```

In the Google reCAPTCHA admin console, make sure the key is a **v3** key and the allowed domains include every origin that can submit the contact form:

- `localhost`
- the production domain
- any preview or staging domains used for real submissions

If the contact form fails CAPTCHA verification, check the key type and domain allowlist before changing any Google Cloud authentication settings.

## GitHub Actions

The repository now includes:

- `CI`: runs `npm ci`, lint, tests, and a production build on every pull request and on pushes to `main`.
- `Deploy`: deploys the `main` branch to Vercel from GitHub Actions once these repository secrets are configured:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

The deploy workflow is intentionally gated by those secrets, so it stays inert until the Vercel project is linked.

---

*Designed and Directed by Michael Zick.*
