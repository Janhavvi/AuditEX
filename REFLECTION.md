# REFLECTION.md

# 1. The hardest bug I hit this week, and how I debugged it

The hardest issue was making public audit links generate proper social previews outside the React app. Initially, I assumed updating meta tags inside the frontend after loading the audit data would be enough. The page looked correct in the browser, so at first it seemed solved.

The problem only became obvious when testing share links in Slack and Twitter. The frontend rendered the correct report, but social previews still showed the default site title and generic metadata from the base HTML file.

My first hypothesis was that the metadata update timing was too slow. I tried forcing the tags to render earlier and tested different React-based metadata approaches, but the result stayed inconsistent. After checking how social crawlers behave, I realized most crawlers do not reliably wait for client-side rendering. They often read the initial HTML response only.

The solution was moving preview generation to the backend entirely.

I added a backend share route that:
- returns crawler-readable HTML
- injects Open Graph and Twitter tags server-side
- generates preview images dynamically
- redirects real users back to the frontend report

After that change, previews finally became consistent across Slack, Twitter, and LinkedIn.

The main lesson was that something “working in the browser” does not automatically mean it works in integrations or crawlers. Social sharing turned out to be more of a backend problem than a frontend one.

---

# 2. A decision I reversed mid-week, and what made me reverse it

One decision I reversed was how much of the audit logic should rely on AI-generated output.

At the beginning, I considered using the model more heavily for recommendations and savings analysis because it would make the product feel more dynamic. After testing that approach, the output became inconsistent very quickly. Similar inputs sometimes produced noticeably different recommendations, which made the audit feel unreliable.

Mid-week, I changed direction and moved all savings calculations into deterministic logic instead.

The AI layer now only writes short readable summaries from already-calculated audit data.

That reversal improved several things:
- recommendations became explainable
- outputs stayed consistent
- testing became easier
- debugging became simpler
- trust in the audit improved

It also reduced the risk of unrealistic savings numbers appearing in reports.

Another reason for reversing the decision was the assignment itself. The product was supposed to feel credible for finance or operations users, and deterministic calculations fit that expectation much better than fully AI-generated financial advice.

In hindsight, separating “business logic” from “AI-generated language” was one of the best architectural decisions in the project.

---

# 3. What I would build in week 2 if I had it

If there were another week available, I would focus less on adding visible features and more on turning the product into a production-ready workflow.

The first priority would be analytics instrumentation.

Right now, the product can generate audits and reports, but deeper funnel tracking is still limited. I would track:
- audit started
- first tool added
- audit completed
- report saved
- share link copied
- PDF downloaded
- lead submitted
- consultation CTA clicked

That would make it much easier to understand where users drop off and which reports actually generate business interest.

The second priority would be performance optimization.

The frontend currently includes:
- charts
- animations
- 3D visuals
- dashboard logic

all inside the same bundle. The application works, but route-level code splitting and lazy loading would improve performance significantly, especially on mobile devices.

I would also replace the current lightweight rate limiting with Redis or an edge-based limiter so the API could scale more safely across multiple backend instances.

Finally, I would build an internal review dashboard for high-savings leads so Credex could sort reports by:
- estimated savings
- company size
- tool stack
- recommendation severity

That would turn the project from a polished demo into a more operational lead-generation system.

---

# 4. How I used AI tools

AI tools were useful mainly as implementation assistants and brainstorming tools.

I used them for:
- debugging ideas
- architecture suggestions
- documentation drafting
- wording cleanup
- component structure suggestions
- API flow discussions

They helped speed up repetitive work and reduced time spent searching through documentation.

At the same time, there were several areas where I intentionally did not trust AI output directly.

I did not use AI for:
- savings calculations
- final audit recommendations
- user interview fabrication
- deployment assumptions
- business metrics calculations without verification

One specific example where the AI output was wrong happened during the email flow work.

At one point, the generated suggestion removed Credex follow-up messaging entirely because it interpreted the emails as overly sales-focused. After re-reading the assignment carefully, I realized the assignment explicitly expected high-savings cases to mention Credex follow-up.

I restored that logic manually and updated the backend flow accordingly.

That experience reinforced something important:
AI tools are helpful accelerators, but they still require careful review against actual product requirements and project constraints.

---

# 5. Self-rating

## Discipline — 7/10

The product reached a working and fairly complete state, but the development timeline became compressed toward the end of the project instead of being distributed evenly across the full week.

---

## Code Quality — 8/10

The audit engine is deterministic, modular, and easier to test than a heavily AI-dependent implementation. The biggest remaining issue is frontend bundle size and performance optimization.

---

## Design Sense — 8/10

The product has a consistent visual identity, polished dashboard flow, strong spacing hierarchy, and a more premium feel than a basic CRUD interface. Some visual effects could still be simplified further for performance.

---

## Problem Solving — 8/10

The strongest improvements came from practical debugging decisions:
- backend-generated social previews
- deterministic audit logic
- sanitized public reports
- fallback summary generation
- lightweight abuse protection

---

## Entrepreneurial Thinking — 7/10

The project connects reasonably well to a real lead-generation workflow and includes GTM, metrics, and economics thinking. The biggest missing piece is still real-world validation through interviews and actual deployment traction.

Overall, the project feels strongest on implementation completeness and product thinking, and weaker on externally validated evidence and long-term scaling polish.