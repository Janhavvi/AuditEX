# Devlog

## Day 1 — 2026-05-19

**Hours worked:** 0

**What I did:** Spent time understanding the assignment requirements, deciding MVP scope, and planning the overall structure for the application.

Planned:
- frontend architecture
- backend structure
- audit logic
- persistence flow
- sharing system
- required markdown documentation

**What I learned:** Planning locally without commits makes progress difficult to demonstrate later in the project history.

**Blockers / what I'm stuck on:** The biggest issue early on was balancing scope. The assignment required engineering work, product polish, deployment preparation, and documentation simultaneously.

I also underestimated how much time the non-coding requirements would take compared to the actual implementation.

**Plan for tomorrow:** Start building the actual project structure and begin committing incremental progress.

## Day 2 — 2026-05-20

**Hours worked:** 0

**What I did:** Worked on shaping the audit logic and deciding how recommendations should behave so the output would feel believable instead of generic.

**What I learned:** The project needed to feel like a focused operational tool rather than another generic AI dashboard.

**Blockers / what I'm stuck on:** One challenge was deciding how “aggressive” the savings recommendations should be.

If the numbers were too conservative, the audit felt weak.
If the numbers were too high, the results immediately looked fake.

**Plan for tomorrow:** Begin implementation and remove unnecessary starter/template code.

## Day 3 — 2026-05-21

**Hours worked:** 5

**What I did:** Built the initial application structure and set up the main frontend and backend foundations.

Added:
- routing
- environment handling
- audit models
- frontend/backend setup

Removed:
- unused starter code
- unnecessary demo files
- unused dependencies

**What I learned:** Cleaning unused code early makes development much easier later.

**Blockers / what I'm stuck on:** The backend environment setup became inconsistent between local development and deployment configuration.

Some API keys and environment variables worked locally but failed once deployment variables were introduced.

**Plan for tomorrow:** Focus on the audit engine and recommendation logic.

## Day 4 — 2026-05-22

**Hours worked:** 3

**What I did:** Worked on the audit engine and report generation flow.

Added:
- spend calculations
- recommendation logic
- savings estimation
- audit summaries
- result formatting

**What I learned:** Savings recommendations needed to stay conservative and explainable. Unrealistic numbers immediately reduced trust in the results.

**Blockers / what I'm stuck on:** The hardest part was balancing simplicity and detail.

Reducing the number of fields improved completion rate, but fewer inputs also reduced the quality of recommendations.

**Plan for tomorrow:** Improve the frontend experience and overall visual quality.

## Day 5 — 2026-05-23

**Hours worked:** 6

**What I did:** Redesigned the frontend experience and improved the audit flow significantly.

Added:
- dynamic audit forms
- recommendation cards
- charts
- animated sections
- 3D visual background
- cleaner layout structure

**What I learned:** Users lose momentum quickly if they enter too much information before seeing useful output.

**Blockers / what I'm stuck on:** Charts, animations, and 3D visuals improved the experience but noticeably increased frontend bundle size.

Mobile performance also became inconsistent because heavy visual sections loaded together on first render.

**Plan for tomorrow:** Focus on sharing, persistence, backend cleanup, and lead capture.

## Day 6 — 2026-05-24

**Hours worked:** 7

**What I did:** Expanded the platform beyond the basic audit flow.

Added:
- shareable reports
- PDF export support
- Open Graph previews
- lead capture flow
- transactional emails
- AI-generated summaries
- assignment documentation

**What I learned:** Social previews required backend-generated metadata because crawlers do not reliably wait for client-side rendering.

**Blockers / what I'm stuck on:** Generating consistent Open Graph previews became more difficult than expected.

The frontend routes worked correctly for users, but social previews sometimes failed because crawlers could not access client-rendered metadata reliably.

**Plan for tomorrow:** Finish cleanup, align remaining requirements, and reduce submission risks.

## Day 7 — 2026-05-25

**Hours worked:** 8

**What I did:** Finished final cleanup and polish.

Added:
- benchmark mode
- referral tracking
- embeddable widget support
- improved sharing flow
- Credex-specific lead routing
- backend refactors
- reusable modules

Also reviewed the project structure, markdown files, deployment preparation, and remaining submission requirements.

**What I learned:** Documentation, deployment readiness, and project organization matter almost as much as working code for assignment-style projects.

**Blockers / what I'm stuck on:** The remaining gaps were mostly outside coding:
- real user interviews
- deployed screenshots
- final deployment verification
- cleaner commit distribution across more days

There were also deployment-related issues around environment variables and API provider limits during testing, especially while switching between AI providers and fallback logic.

**Plan for tomorrow:** Deploy the final version, capture production screenshots, verify Lighthouse scores, complete user interviews, and replace remaining placeholders with final evidence.
