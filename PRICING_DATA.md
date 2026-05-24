# Pricing Data

Last reviewed: 2026-05-21

AuditEX uses public list prices only as benchmarks. API and enterprise plans are custom or usage-based, so user-entered monthly spend remains the source of truth for those lines. Every dollar value used by the deterministic audit engine maps to the entries below.

## Cursor

- Hobby: $0/user/month — https://cursor.com/pricing — verified 2026-05-21
- Pro: $20/user/month — https://cursor.com/pricing — verified 2026-05-21
- Business: $40/user/month — https://cursor.com/pricing — verified 2026-05-21
- Enterprise: custom pricing, stored as $0 benchmark and evaluated from entered spend — https://cursor.com/pricing — verified 2026-05-21

## GitHub Copilot

- Individual: $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-21
- Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-21
- Enterprise: $39/user/month — https://github.com/features/copilot/plans — verified 2026-05-21

## Claude

- Free: $0/user/month — https://claude.com/pricing — verified 2026-05-21
- Pro: $20/user/month — https://claude.com/pricing — verified 2026-05-21
- Max: $100/user/month benchmark — https://claude.com/pricing — verified 2026-05-21
- Team: $30/user/month — https://claude.com/pricing — verified 2026-05-21
- Enterprise: custom pricing, stored as $0 benchmark and evaluated from entered spend — https://claude.com/pricing — verified 2026-05-21
- API direct: usage-based, entered spend used as source of truth — https://platform.claude.com/docs/en/about-claude/pricing — verified 2026-05-21

## ChatGPT

- Plus: $20/user/month — https://chatgpt.com/pricing/ — verified 2026-05-21
- Team: $30/user/month benchmark — https://chatgpt.com/pricing/ — verified 2026-05-21
- Enterprise: custom pricing, stored as $0 benchmark and evaluated from entered spend — https://chatgpt.com/pricing/ — verified 2026-05-21
- API direct: usage-based, entered spend used as source of truth — https://openai.com/api/pricing/ — verified 2026-05-21

## Anthropic API Direct

- API direct: usage-based, entered spend used as source of truth — https://platform.claude.com/docs/en/about-claude/pricing — verified 2026-05-21

## NVIDIA NIM

- API direct: usage-based or self-hosted NIM spend, entered spend used as source of truth — https://docs.api.nvidia.com/nim/docs/overview — verified 2026-05-21
- Run anywhere / enterprise deployment context: custom infrastructure cost, entered spend used as source of truth — https://docs.api.nvidia.com/nim/docs/run-anywhere — verified 2026-05-21

## OpenAI API Direct

- API direct: usage-based, entered spend used as source of truth — https://openai.com/api/pricing/ — verified 2026-05-21

## Gemini

- Pro: $19.99/user/month — https://gemini.google/subscriptions/ — verified 2026-05-21
- Ultra: $99.99/user/month benchmark — https://gemini.google/subscriptions/ — verified 2026-05-21
- API: usage-based, entered spend used as source of truth — https://ai.google.dev/gemini-api/docs/pricing — verified 2026-05-21

## Windsurf

- Free: $0/user/month — https://windsurf.com/pricing — verified 2026-05-21
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2026-05-21
- Team: $30/user/month — https://windsurf.com/pricing — verified 2026-05-21
- Enterprise: custom pricing, stored as $0 benchmark and evaluated from entered spend — https://windsurf.com/pricing — verified 2026-05-21

## v0

- Free: $0/user/month with included credits — https://v0.app/pricing — verified 2026-05-21
- Pro: $20/user/month benchmark — https://v0.app/pricing — verified 2026-05-21
- Team: $30/user/month benchmark — https://v0.app/pricing — verified 2026-05-21
- Enterprise: custom pricing, stored as $0 benchmark and evaluated from entered spend — https://v0.app/pricing — verified 2026-05-21

## Defensibility Rules

- Seat savings are calculated from unused seats multiplied by public seat price, or by effective entered spend per seat when public seat price is custom or usage-based.
- Plan downgrade savings are calculated only when a cheaper public plan exists and the team size/use case makes the current plan plausibly overpowered.
- API routing savings use conservative assumptions and are shown only for high-volume API spend.
- Credits, committed-use, private-offer, education, nonprofit, and startup-credit opportunities are flagged with $0 estimated savings until eligibility is confirmed.
- Enterprise and API direct plans do not invent list pricing; they use the user's entered current monthly spend.
