---
name: sync-agent-briefs
description: Sync this repo's agent-orientation files after structural or meaningful codebase changes. Use when routes, workflows, integrations, environment variables, architecture, layout, CI, security posture, or other durable project facts change, or when finalizing meaningful work that may require AGENTS.md, CLAUDE.md, and GEMINI.md updates.
---

# Sync Agent Briefs

Use this skill for durable repo changes, not session notes. Typical triggers:

- public routes, API routes, component groups, content sources, or key files changed
- root scripts, CI/security behavior, lint/typecheck/test policy, or completion workflow changed
- environment variables, setup steps, analytics, SEO, email, captcha, OpenAI, or operating conventions changed

## Workflow

1. Read the relevant code changes and decide whether the repo brief is now stale.
2. Make durable documentation edits in `AGENTS.md` first. Treat it as the canonical source.
3. Run `npm run agent-briefs:sync` from the repo root to regenerate `CLAUDE.md` and `GEMINI.md`.
4. Run `npm run agent-briefs:check` to confirm the three files are synchronized.
5. Before marking meaningful work done, run `npm run lint`, `npm run typecheck`, and relevant tests.

## Rules

- Do not mark work done while `npm run lint` or `npm run typecheck` fail.
- For PR-ready validation, prefer `npm run check`.
- Keep the three orientation files semantically aligned. Harness-specific title and sibling-file lines are the only intended differences.
- Do not add ephemeral TODOs, debugging notes, or session history to these files.
