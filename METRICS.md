# METRICS.md

The main metric for AuditEX is:

> qualified high-savings audits per week

A qualified audit means:
- someone completed the audit
- the report showed meaningful savings potential
- the user saved the report or submitted contact details

This matters more than daily active users or pageviews because AuditEX is not a product people use every day. Most teams only think seriously about AI spend during budgeting, renewals, or when costs suddenly start increasing. The value comes from finding companies that actually have a financial problem worth solving.

Three input metrics influence this directly.

## 1. Audit completion rate

This measures how many users finish the audit after starting it.

If people drop off early, it usually means:
- the process feels too long
- users are confused
- the value is not obvious fast enough

Reducing friction here has the biggest impact on the funnel.

---

## 2. Completed audit → lead capture rate

This tracks how many users:
- save the report
- enter their email
- request follow-up
- share the results internally

If users are willing to do that, the output probably feels useful and believable.

---

## 3. Report sharing rate

One useful signal is whether reports get forwarded to:
- founders
- finance teams
- operations leads
- engineering managers

If people are sharing reports internally, it usually means the audit surfaced something important enough to discuss.

---

# First Things To Instrument

The first events worth tracking are:

- landing page CTA clicked
- first tool added
- audit started
- audit completed
- report viewed
- lead form submitted
- share link copied
- PDF downloaded
- Credex CTA clicked

Each event should include lightweight anonymous context such as:
- estimated spend range
- number of tools entered
- company size range
- estimated savings range

Sensitive company or billing data should not be stored directly inside analytics events.

---

# Pivot Trigger

The first serious warning sign would be:

> fewer than 5% of completed audits becoming qualified leads after the first 100 completed audits

That would probably mean:
- the wrong audience is using the tool
- the audit is attracting curiosity traffic instead of buyers
- the savings recommendations are too weak
- the value proposition is unclear

Another bad sign would be audit completion dropping below 35%.

That usually means users are being asked for too much information before seeing value.

At this stage, the focus is not maximizing traffic.

The focus is learning whether the product consistently finds companies with real AI spend problems and turns those insights into meaningful business conversations.